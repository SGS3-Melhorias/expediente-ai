# Assistente de Informações SGS (SEI e CPA)

App interno da Secretaria de Governança de Sistemas (TJSP) para a equipe ler o PDF de um expediente e redigir a **Informação** no modelo certo.

Não há integração com o SEI nem com o SAJADM-CPA. O fluxo continua começando pelo download manual do processo.

## O que o app faz

1. Você sobe o PDF completo do processo.
2. O app extrai o texto e **detecta SEI ou CPA** (com opção de corrigir).
3. A leitura organizada segue o prompt de análise (diagnóstico, mapa, três camadas de resumo, insights).
4. Você descreve o posicionamento da SGS.
5. A minuta segue o prompt de redação:
   - **SEI** — texto no padrão da Informação SGS para copiar no editor web.
   - **CPA** — o mesmo texto no Word com cabeçalho, logos e campos do modelo TJSP/SGS.

Marcações `[COMPLETAR]` e `[VERIFICAR]` aparecem numa lista para revisão.

## API DeepSeek

A leitura e a redação usam a API da DeepSeek (`deepseek-chat`).

1. Entre em [platform.deepseek.com](https://platform.deepseek.com).
2. Crie uma chave em **API Keys** e adicione saldo se ainda não houver.
3. Copie `.env.example` para `.env.local` e preencha `DEEPSEEK_API_KEY`.
4. Reinicie o servidor.

A equipe usa **uma chave da unidade** no servidor. Sem chave, a fila abre com um expediente de demonstração; análise e redação reais ficam bloqueadas.

## Como rodar

```bash
npm install
cp .env.example .env.local   # depois, a chave da API
npm run dev
```

Abra [http://127.0.0.1:43127](http://127.0.0.1:43127).

Dados da fila ficam em `data/` (JSON + PDFs). Não há login neste recorte: quem acessa a instância vê a mesma fila.

Em **Unidade e API**, ajuste vocativo, signatários e o prefixo “Informação SGS”.

## Modelos versionados

- `prompts/leitor-pdf.md` — leitura do PDF
- `prompts/redacao-informacao.md` — redação da Informação
- `templates/cpa-informacao.docx` — Word CPA (placeholders)
- `templates/sei-informacao.md` — estrutura textual SEI
- `templates/SEI_0117491_Informacao.pdf` — referência visual SEI
