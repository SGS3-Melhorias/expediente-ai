import OpenAI from "openai";
import { deepSeekModel, hasDeepSeekKey } from "./api-key";
import { chunkText } from "./pdf";
import { extractMarkers } from "./markers";
import {
  loadLeitorPrompt,
  loadRedacaoPrompt,
  loadSeiTemplate,
  settingsBlock,
} from "./prompts";
import { readSettings } from "./settings";
import type { Analise, Expediente, Minuta, Sistema } from "./types";

function client() {
  if (!hasDeepSeekKey()) {
    throw new Error("DEEPSEEK_API_KEY ausente");
  }
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com",
  });
}

function parseJsonObject(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Resposta da IA sem JSON");
  return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
}

async function complete(system: string, user: string) {
  const res = await client().chat.completions.create({
    model: deepSeekModel(),
    max_tokens: 8000,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const text = res.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("IA não retornou texto");
  return text;
}

export async function analyzePdfText(input: {
  text: string;
  pages: number;
  fileName: string;
}): Promise<Analise> {
  const system = await loadLeitorPrompt();
  const chunks = chunkText(input.text);
  const processadoPorPartes = chunks.length > 1;
  const avisoTamanho = processadoPorPartes
    ? `O PDF foi processado em ${chunks.length} partes (${input.pages} páginas). Trechos além do limite foram lidos em sequência.`
    : undefined;

  let notasPartes = "";
  if (processadoPorPartes) {
    for (let i = 1; i < chunks.length; i++) {
      const note = await complete(
        "Você resume trechos de expediente administrativo sem inventar fatos. Responda em português, em tópicos.",
        `Parte ${i + 1}/${chunks.length} do PDF ${input.fileName}:\n\n${chunks[i]}`,
      );
      notasPartes += `\n\n## Notas da parte ${i + 1}\n${note}`;
    }
  }

  const jsonInstrucao = `Responda APENAS um JSON com este formato:
{
  "diagnostico": { "titulo": "", "paginas": "", "tipo": "", "idioma": "", "complexidade": "" },
  "mapaEstrutural": "markdown",
  "resumoExecutivo": "",
  "resumoAnalitico": "",
  "resumoDetalhado": "",
  "insights": {
    "tese": "",
    "pontosChave": [],
    "dados": [],
    "termos": [{ "termo": "", "definicao": "" }],
    "lacunas": []
  }
}
Não invente fatos. Se ilegível, declare. Objetivo: manifestação em expediente SGS.`;

  const raw = await complete(
    system,
    `${jsonInstrucao}\n\nArquivo: ${input.fileName}\nPáginas: ${input.pages}\n${avisoTamanho ?? ""}\n\nTEXTO:\n${chunks[0]}${notasPartes}`,
  );
  const data = parseJsonObject(raw);
  const diag = (data.diagnostico ?? {}) as Record<string, unknown>;
  const insights = (data.insights ?? {}) as Record<string, unknown>;
  return {
    diagnostico: {
      titulo: String(diag.titulo ?? input.fileName),
      paginas: (diag.paginas as string | number | undefined) ?? input.pages,
      tipo: String(diag.tipo ?? "expediente administrativo"),
      idioma: String(diag.idioma ?? "português"),
      complexidade: String(diag.complexidade ?? "técnico"),
    },
    mapaEstrutural: String(data.mapaEstrutural ?? ""),
    resumoExecutivo: String(data.resumoExecutivo ?? ""),
    resumoAnalitico: String(data.resumoAnalitico ?? ""),
    resumoDetalhado: String(data.resumoDetalhado ?? ""),
    insights: {
      tese: String(insights.tese ?? ""),
      pontosChave: Array.isArray(insights.pontosChave)
        ? insights.pontosChave.map(String)
        : [],
      dados: Array.isArray(insights.dados) ? insights.dados.map(String) : [],
      termos: Array.isArray(insights.termos)
        ? (insights.termos as { termo?: string; definicao?: string }[]).map((t) => ({
            termo: String(t.termo ?? ""),
            definicao: String(t.definicao ?? ""),
          }))
        : [],
      lacunas: Array.isArray(insights.lacunas) ? insights.lacunas.map(String) : [],
    },
    processadoPorPartes,
    avisoTamanho,
    criadoEm: new Date().toISOString(),
  };
}

export async function answerQuestion(input: {
  expediente: Expediente;
  pergunta: string;
}): Promise<string> {
  const system = await loadLeitorPrompt();
  return complete(
    system,
    `Responda com base apenas no expediente. Se não estiver no texto, diga que não consta.\n\nPergunta: ${input.pergunta}\n\nResumo já produzido:\n${input.expediente.analise?.resumoDetalhado ?? ""}\n\nTexto (recorte):\n${input.expediente.textoExtraido.slice(0, 90_000)}`,
  );
}

function montarTextoCompleto(
  sistema: Sistema,
  fields: Pick<
    Minuta,
    | "processo"
    | "assunto"
    | "numeroInformacao"
    | "interessado"
    | "vocativo"
    | "corpo"
    | "signatarios"
  >,
) {
  if (sistema === "SEI") {
    return [
      `Processo SEI nº ${fields.processo}`,
      `Assunto: ${fields.assunto}`,
      `Informação SGS nº ${fields.numeroInformacao}`,
      fields.vocativo,
      "",
      fields.corpo,
      "",
      "À consideração superior para deliberação.",
    ].join("\n");
  }
  return [
    `Processo nº ${fields.processo}`,
    `Assunto: ${fields.assunto}`,
    "",
    `Informação SGS ${fields.numeroInformacao}`,
    "",
    fields.vocativo,
    "",
    fields.corpo,
    "",
    fields.signatarios,
  ].join("\n");
}

export async function draftInformacao(input: {
  expediente: Expediente;
}): Promise<Minuta> {
  const [system, seiTpl, settings] = await Promise.all([
    loadRedacaoPrompt(),
    loadSeiTemplate(),
    readSettings(),
  ]);
  const sistema = input.expediente.sistema;
  const analise = input.expediente.analise;
  const resumo = [
    analise?.resumoExecutivo,
    analise?.resumoAnalitico,
    analise?.resumoDetalhado,
    analise?.insights.tese,
    analise?.insights.pontosChave.join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");

  const jsonInstrucao = `Responda APENAS um JSON:
{
  "processo": "",
  "assunto": "",
  "numeroInformacao": "",
  "interessado": "",
  "vocativo": "",
  "corpo": "texto da informação, sem cabeçalho institucional nem bloco de assinatura",
  "signatarios": "",
  "observacao": "opcional"
}
O campo corpo deve iniciar fazendo referência ao que a SGS deve cumprir (ex.: em cumprimento ao r. despacho...).
Sistema ${sistema}: ${sistema === "CPA" ? "referências a documentos com pág(s) ou páginas, nunca fls/folhas. Inclua vocativo e signatários no JSON." : "Siga o modelo SEI: Processo SEI nº / Assunto / Informação SGS nº / vocativo / corpo em parágrafos corridos / 'À consideração superior para deliberação.'. Não invente rodapé de autenticidade. Signatários não entram no texto copiado (a assinatura é no SEI)."}
Use [COMPLETAR] e [VERIFICAR] quando necessário.`;

  const user = `${jsonInstrucao}

**Sistema:** ${sistema}
**Resumo do expediente:** ${resumo || input.expediente.textoExtraido.slice(0, 20_000)}
**Proposta/Posicionamento:** ${input.expediente.posicionamento}
**Informações adicionais:** ${input.expediente.informacoesAdicionais || "(nenhuma)"}
**Número do processo detectado:** ${input.expediente.deteccao.processo ?? ""}
**Assunto:** ${input.expediente.assunto}

Configuração da unidade:
${settingsBlock(settings)}

${sistema === "SEI" ? `Template SEI:\n${seiTpl}` : "Template CPA: cabeçalho Processo nº / Assunto / Informação SGS / vocativo / corpo / signatários. Header e logos entram no Word gerado."}`;

  const raw = await complete(system, user);
  const data = parseJsonObject(raw);
  const fields = {
    processo: String(data.processo || input.expediente.deteccao.processo || "[COMPLETAR]"),
    assunto: String(data.assunto || input.expediente.assunto || "[COMPLETAR]"),
    numeroInformacao: String(data.numeroInformacao || settings.proximoNumeroSgs),
    interessado: String(data.interessado || settings.unidade),
    vocativo: String(data.vocativo || settings.vocativo),
    corpo: String(data.corpo || raw),
    signatarios: String(data.signatarios || settings.signatarios),
  };
  const textoCompleto = montarTextoCompleto(sistema, fields);
  const marcacoes = extractMarkers(
    `${fields.vocativo}\n${fields.corpo}\n${fields.signatarios}\n${textoCompleto}`,
  );
  return {
    ...fields,
    textoCompleto,
    marcacoes,
    observacao: data.observacao ? String(data.observacao) : undefined,
    criadoEm: new Date().toISOString(),
  };
}
