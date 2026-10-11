"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Download,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDate, sistemaHint, STATUS_LABEL } from "@/lib/labels";
import type { Expediente, Sistema } from "@/lib/types";

export default function ExpedientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [exp, setExp] = useState<Expediente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [asking, setAsking] = useState(false);
  const [pergunta, setPergunta] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/expedientes/${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Não encontrado.");
        return json as Expediente;
      })
      .then((data) => {
        if (!cancelled) setExp(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/expedientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    setExp(json);
    return json as Expediente;
  }

  async function analyze() {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/expedientes/${id}/analyze`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setExp(json);
      toast.success("Leitura organizada concluída.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na análise.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function draft() {
    setDrafting(true);
    try {
      const res = await fetch(`/api/expedientes/${id}/draft`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setExp(json);
      toast.success("Informação gerada. Revise as marcações.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na redação.");
    } finally {
      setDrafting(false);
    }
  }

  async function ask() {
    if (!pergunta.trim()) return;
    setAsking(true);
    try {
      const res = await fetch(`/api/expedientes/${id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setExp(json);
      setPergunta("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na pergunta.");
    } finally {
      setAsking(false);
    }
  }

  async function copyText() {
    if (!exp?.minuta?.textoCompleto) return;
    await navigator.clipboard.writeText(exp.minuta.textoCompleto);
    toast.success("Texto copiado. Cole no editor do SEI.");
  }

  async function remove() {
    if (!confirm("Excluir este expediente da fila local?")) return;
    await fetch(`/api/expedientes/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Expediente indisponível</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!exp) {
    return <p className="text-sm text-muted-foreground">Abrindo expediente…</p>;
  }

  const analise = exp.analise;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge>{exp.sistema}</Badge>
            <Badge variant="outline">{STATUS_LABEL[exp.status]}</Badge>
            {exp.demo ? <Badge variant="secondary">Demonstração</Badge> : null}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{exp.assunto}</h1>
          <p className="text-sm text-muted-foreground">
            {exp.arquivoNome} · {exp.paginas} páginas · atualizado em{" "}
            {formatDate(exp.atualizadoEm)}
          </p>
          <p className="text-sm">{sistemaHint(exp.sistema)}</p>
        </div>
        <Button variant="outline" size="sm" onClick={remove}>
          <Trash2 />
          Excluir
        </Button>
      </div>

      {exp.deteccao.precisaConfirmar && !exp.sistemaConfirmado ? (
        <Alert>
          <AlertTitle>Confirme o sistema antes de redigir</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Palpite: <strong>{exp.deteccao.sistema}</strong> (
              {exp.deteccao.confianca}). Sinais: {exp.deteccao.sinais.join("; ")}.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => patch({ sistema: "SEI" })}>
                É SEI
              </Button>
              <Button size="sm" variant="secondary" onClick={() => patch({ sistema: "CPA" })}>
                É CPA
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Sistema</Label>
            <Select
              value={exp.sistema}
              onValueChange={(v) => {
                if (v) void patch({ sistema: v as Sistema });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEI">SEI</SelectItem>
                <SelectItem value="CPA">CPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="processo">Número do processo</Label>
            <Input
              id="processo"
              defaultValue={exp.deteccao.processo ?? ""}
              onBlur={(e) => {
                if (e.target.value !== (exp.deteccao.processo ?? "")) {
                  void patch({ processo: e.target.value });
                }
              }}
            />
          </div>
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="assunto">Assunto</Label>
            <Input
              id="assunto"
              defaultValue={exp.assunto}
              onBlur={(e) => {
                if (e.target.value !== exp.assunto) void patch({ assunto: e.target.value });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analise">
        <TabsList>
          <TabsTrigger value="analise">Leitura</TabsTrigger>
          <TabsTrigger value="redacao">Redação</TabsTrigger>
        </TabsList>

        <TabsContent value="analise" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={analyze} disabled={analyzing || exp.demo}>
              {analyzing ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              {analise ? "Refazer leitura" : "Organizar o PDF"}
            </Button>
            {exp.demo ? (
              <p className="self-center text-xs text-muted-foreground">
                A demonstração já traz a leitura pronta. Envie um PDF real para
                chamar a API.
              </p>
            ) : null}
          </div>

          {!analise ? (
            <Card>
              <CardHeader>
                <CardTitle>Ainda sem leitura</CardTitle>
                <CardDescription>
                  A análise decompõe o PDF em diagnóstico, mapa, três camadas de
                  resumo e pontos-chave — sem inventar fato.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              {analise.avisoTamanho ? (
                <Alert>
                  <AlertTitle>PDF longo</AlertTitle>
                  <AlertDescription>{analise.avisoTamanho}</AlertDescription>
                </Alert>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnóstico</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p>
                      <strong>Título:</strong> {analise.diagnostico.titulo}
                    </p>
                    <p>
                      <strong>Páginas:</strong> {analise.diagnostico.paginas}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {analise.diagnostico.tipo}
                    </p>
                    <p>
                      <strong>Idioma:</strong> {analise.diagnostico.idioma}
                    </p>
                    <p>
                      <strong>Complexidade:</strong> {analise.diagnostico.complexidade}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Mapa estrutural</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {analise.mapaEstrutural}
                    </pre>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo executivo</CardTitle>
                  <CardDescription>Até 30 segundos de leitura</CardDescription>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  {analise.resumoExecutivo}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo analítico</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analise.resumoAnalitico}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo detalhado</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analise.resumoDetalhado}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Tese:</strong> {analise.insights.tese}
                  </p>
                  <div>
                    <strong>Pontos-chave</strong>
                    <ul className="mt-1 list-disc pl-5">
                      {analise.insights.pontosChave.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  {analise.insights.dados.length ? (
                    <div>
                      <strong>Dados</strong>
                      <ul className="mt-1 list-disc pl-5">
                        {analise.insights.dados.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {analise.insights.termos.length ? (
                    <div>
                      <strong>Termos</strong>
                      <ul className="mt-1 list-disc pl-5">
                        {analise.insights.termos.map((t) => (
                          <li key={t.termo}>
                            <strong>{t.termo}:</strong> {t.definicao}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {analise.insights.lacunas.length ? (
                    <div>
                      <strong>Lacunas</strong>
                      <ul className="mt-1 list-disc pl-5">
                        {analise.insights.lacunas.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas sobre o conteúdo</CardTitle>
                  <CardDescription>
                    Deseja aprofundar alguma seção? A resposta usa só o PDF.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    rows={3}
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    placeholder="Ex.: Qual despacho determina o prazo de resposta?"
                  />
                  <Button onClick={ask} disabled={asking || !pergunta.trim()}>
                    {asking ? <Loader2 className="animate-spin" /> : null}
                    Perguntar
                  </Button>
                  {exp.perguntas.map((q) => (
                    <div key={q.em} className="rounded-md border bg-muted/40 p-3 text-sm">
                      <p className="font-medium">{q.pergunta}</p>
                      <p className="mt-2 whitespace-pre-wrap">{q.resposta}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="redacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posicionamento da SGS</CardTitle>
              <CardDescription>
                Diga o que a Informação deve propor. A redação segue o modelo{" "}
                {exp.sistema}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pos">Proposta / posicionamento</Label>
                <Textarea
                  id="pos"
                  rows={5}
                  defaultValue={exp.posicionamento}
                  onBlur={(e) => {
                    if (e.target.value !== exp.posicionamento) {
                      void patch({ posicionamento: e.target.value });
                    }
                  }}
                  placeholder="Ex.: sugerir remessa à SPI após validar as medidas de contorno da e-CEMAN."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra">Informações adicionais</Label>
                <Textarea
                  id="extra"
                  rows={3}
                  defaultValue={exp.informacoesAdicionais}
                  onBlur={(e) => {
                    if (e.target.value !== exp.informacoesAdicionais) {
                      void patch({ informacoesAdicionais: e.target.value });
                    }
                  }}
                  placeholder="Legislação, precedentes, número do despacho, observações."
                />
              </div>
              <Button onClick={draft} disabled={drafting}>
                {drafting ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                {exp.minuta ? "Regenerar Informação" : "Gerar Informação"}
              </Button>
            </CardContent>
          </Card>

          {exp.minuta ? (
            <>
              {exp.minuta.marcacoes.length ? (
                <Alert>
                  <AlertTitle>Marcações para revisão</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 list-disc pl-4">
                      {exp.minuta.marcacoes.map((m, i) => (
                        <li key={`${m.tipo}-${i}`}>
                          <strong>[{m.tipo}]</strong> {m.contexto}{" "}
                          <span className="text-muted-foreground">{m.trecho}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertTitle className="flex items-center gap-2">
                    <Check className="size-4" />
                    Sem [COMPLETAR] ou [VERIFICAR]
                  </AlertTitle>
                  <AlertDescription>
                    Ainda assim, leia o texto antes de colar no SEI ou gerar o
                    Word.
                  </AlertDescription>
                </Alert>
              )}

              {exp.minuta.observacao ? (
                <Alert>
                  <AlertTitle>Observação da redação</AlertTitle>
                  <AlertDescription>{exp.minuta.observacao}</AlertDescription>
                </Alert>
              ) : null}

              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Minuta</CardTitle>
                    <CardDescription>
                      {exp.sistema === "SEI"
                        ? "Copie e cole no editor web do SEI."
                        : "Revise e baixe o Word no modelo CPA."}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={copyText}>
                      <Copy />
                      Copiar texto
                    </Button>
                    {exp.sistema === "CPA" ? (
                      <Button
                        nativeButton={false}
                        render={<a href={`/api/expedientes/${exp.id}/export/cpa`} />}
                      >
                        <Download />
                        Baixar Word CPA
                      </Button>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-4 font-sans text-sm leading-relaxed">
                    {exp.minuta.textoCompleto}
                  </pre>
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
