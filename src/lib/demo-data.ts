import type { Expediente } from "./types";

const now = "2026-10-09T19:43:00.000Z";

export const DEMO_EXPEDIENTE: Expediente = {
  id: "demo-cpa-e-ceman",
  arquivoNome: "Informacao_SGS_262-2026_CPA_2011-00135669.pdf",
  pdfPath: "",
  demo: true,
  textoExtraido:
    "Demonstração (sem PDF anexado). Processo CPA 2011/00135669 — Informações sobre o status da funcionalidade e-CEMAN no sistema eproc, Chamado SMAX nº 70312178, Central de Cumprimento Remoto de Mandados (REMCEMAN). A SGS formalizou análise de governança no expediente 2026/8.26.000011443.8. Testes em homologação sanaram inconsistências técnicas; zoneamento ajustado para exibir órgão REMCEMAN apenas em logradouros vinculados. Demandas futuras em Fila Única (8588, 8590, 8591, 8592) nos termos do Provimento nº 2.834/2026. Encaminhamento sugerido à SPI, Presidência e CGJ.",
  paginas: 3,
  assunto:
    "Informações sobre o status da funcionalidade e-CEMAN no sistema eproc",
  sistema: "CPA",
  sistemaConfirmado: true,
  deteccao: {
    sistema: "CPA",
    confianca: "alta",
    processo: "2011/00135669",
    assunto:
      "Informações sobre o status da funcionalidade e-CEMAN no sistema eproc",
    sinais: ["Número CPA 2011/00135669", "Expediente de demonstração"],
    precisaConfirmar: false,
  },
  status: "pronto",
  analise: {
    diagnostico: {
      titulo:
        "Informação SGS 262/2026 — status da funcionalidade e-CEMAN no eproc",
      paginas: 3,
      tipo: "Informação administrativa / expediente CPA",
      idioma: "português",
      complexidade: "técnico",
    },
    mapaEstrutural: `- Histórico de testes e ajustes (alta)
  - Inconsistências técnicas
  - Zoneamento e exibição
  - Tratativas com a SADM-CR
- Levantamento de requisitos (alta)
  - Medidas de contorno viáveis
  - Fila Única (desenvolvimentos futuros)
- Encaminhamento e conclusão (alta)`,
    resumoExecutivo:
      "A SGS informa que a funcionalidade e-CEMAN no eproc está apta a iniciar operação com medidas de contorno já parametrizadas. Pendências de desenvolvimento foram cadastradas em Fila Única. Propõe-se remessa à SPI e, em seguida, à Presidência e à CGJ.",
    resumoAnalitico:
      "O expediente responde ao Pedido de Informação nº 297/2026 (STI 1) e ao Chamado SMAX nº 70312178, sobre a Central de Cumprimento Remoto de Mandados. Testes conjuntos com a STI sanaram falhas de homologação e de zoneamento. A Central opera com demanda média de 30 mil mandados/mês e cerca de 160 oficiais, com distribuição por unidade prisional. Requisitos imediatos foram atendidos por CEP/zona, painel de administração, certidão intermediária e relatórios nativos. Quatro evoluções (trava de cotas, bloqueio global, janelas de distribuição e prévia automática) seguem em Fila Única, nos termos do Provimento nº 2.834/2026.",
    resumoDetalhado:
      "Trata-se de expediente encaminhado à SGS para atendimento ao Pedido de Informação nº 297/2026 (STI 1), referente ao status e à validação da funcionalidade e-CEMAN no eproc, objeto do Chamado SMAX nº 70312178, instaurado para implantação da REMCEMAN. A SGS formalizou análise de governança, histórico de tratativas e levantamento de requisitos no expediente n. 2026/8.26.000011443.8. Os testes com a STI resultaram na solução de inconsistências técnicas em homologação; o zoneamento passou a exibir o órgão REMCEMAN apenas para logradouros vinculados; houve alinhamento com a chefia da Central Remota (SADM-CR) sobre fluxos de mandados e certidões. Considerando a dinâmica da Central (distribuição por unidade prisional/de internação), a SGS mapeou requisitos atendidos por parametrização e recursos nativos do Painel de Gestão, e cadastrou em Fila Única as demandas 8588, 8590, 8591 e 8592. A conclusão sugere remessa à Secretaria de Primeira Instância e, após, à Presidência e à CGJ.",
    insights: {
      tese: "A operação da e-CEMAN pode iniciar com as medidas de contorno já validadas; evoluções estruturais ficam na Fila Única.",
      pontosChave: [
        "Processo CPA 2011/00135669",
        "Pedido de Informação 297/2026 (STI 1)",
        "Chamado SMAX 70312178 — REMCEMAN / e-CEMAN",
        "Expediente de governança 2026/8.26.000011443.8",
        "Homologação com inconsistências técnicas sanadas",
        "Zoneamento por CEP/logradouro",
        "Demanda média 30 mil mandados/mês e ~160 oficiais",
        "Fila Única 8588, 8590, 8591 e 8592",
        "Provimento nº 2.834/2026",
        "Encaminhamento SPI → Presidência e CGJ",
      ],
      dados: [
        "Demanda média de 30 mil mandados/mês (pág. do histórico operacional)",
        "Cerca de 160 oficiais na Central Remota",
      ],
      termos: [
        {
          termo: "e-CEMAN",
          definicao: "Funcionalidade no eproc ligada à Central de Cumprimento Remoto de Mandados.",
        },
        {
          termo: "REMCEMAN",
          definicao: "Central de Cumprimento Remoto de Mandados.",
        },
        {
          termo: "Fila Única",
          definicao: "Cadastro de demandas de desenvolvimento para deliberação da governança.",
        },
      ],
      lacunas: [
        "O PDF de demonstração não reproduz o inteiro teor do processo; use um upload real para análise completa.",
      ],
    },
    criadoEm: now,
  },
  perguntas: [],
  posicionamento:
    "Informar que a e-CEMAN está viável para início das atividades com as medidas de contorno já parametrizadas, registrar as demandas de Fila Única e sugerir remessa à SPI, com posterior apreciação da Presidência e da CGJ.",
  informacoesAdicionais: "Provimento nº 2.834/2026. Referências a documentos por pág(s).",
  minuta: {
    processo: "2011/00135669",
    assunto:
      "Informações sobre o status da funcionalidade e-CEMAN no sistema eproc",
    numeroInformacao: "262/2026",
    interessado: "Secretaria de Governança de Sistemas",
    vocativo:
      "Ilmo. Senhor Fabiano Sousa Martins,\nSecretário de Governança de Sistemas",
    corpo: `Em cumprimento ao r. Pedido de Informação nº 297/2026 (STI 1), trata-se de expediente encaminhado a esta Secretaria de Governança de Sistemas (SGS) referente ao status e à validação da funcionalidade e-CEMAN no sistema eproc, objeto do Chamado SMAX nº 70312178, instaurado para a implantação da Central de Cumprimento Remoto de Mandados (REMCEMAN).

Em atenção ao solicitado, informamos que esta Secretaria formalizou a análise de governança, o histórico de tratativas e o levantamento de requisitos de negócio por meio do expediente específico n. 2026/8.26.000011443.8.

Abaixo, sintetizam-se as principais definições e o estágio atual de homologação do cenário apresentado:

1. Histórico de testes e ajustes operacionais

Os testes e parametrizações realizados em conjunto com a STI resultaram na solução das inconsistências técnicas nos ambientes de homologação. Ajustaram-se as regras de zoneamento para que o sistema eproc exiba o órgão REMCEMAN apenas para logradouros devidamente vinculados. Houve alinhamento com a chefia da Central Remota (SADM-CR), abrangendo fluxos de mandados e certidões.

2. Levantamento de requisitos e viabilidade de início

Considerando a dinâmica própria da Central Remota — cuja distribuição é realizada por unidade prisional/de internação (com demanda média de 30 mil mandados/mês e cerca de 160 oficiais) —, a SGS mapeou as necessidades operacionais e estabeleceu medidas de contorno para viabilizar o início das atividades.

Identificaram-se funcionalidades nativas que demandam desenvolvimento sistêmico futuro e que já foram cadastradas em Fila Única para deliberação dos órgãos de governança, conforme o Provimento nº 2.834/2026: Trava de Cotas por Oficial/Perfil (Fila Única nº 8588); Bloqueio Global do Oficial/Afastamentos (nº 8590); Distribuição por Janelas/Dias Alternados (nº 8591); Prévia/Rascunho da Distribuição Automática (nº 8592).

3. Encaminhamento e conclusão

Validados os aspectos de governança e verificada a viabilidade do início das atividades mediante as medidas de contorno propostas, a SGS sugere o prosseguimento do feito com a remessa do expediente à Secretaria de Primeira Instância (SPI) para análise e manifestação sobre as regras de negócio, fluxos de trabalho e priorização de desenvolvimentos, com posterior submissão à apreciação da Egrégia Presidência e da Egrégia Corregedoria Geral da Justiça (CGJ).

Diante do exposto, sugerimos a remessa do expediente à apreciação superior da Egrégia Presidência para apreciação e deliberação.`,
    signatarios:
      "[COMPLETAR]\nCoordenador – SGS 3.1\n\n[COMPLETAR]\nDiretor – SGS 3",
    textoCompleto: "",
    marcacoes: [
      {
        tipo: "COMPLETAR",
        trecho: "[COMPLETAR]",
        contexto: "Nomes dos signatários na configuração da unidade.",
      },
    ],
    criadoEm: now,
  },
  criadoEm: now,
  atualizadoEm: now,
};

DEMO_EXPEDIENTE.minuta!.textoCompleto = [
  `Processo nº ${DEMO_EXPEDIENTE.minuta!.processo}`,
  `Assunto: ${DEMO_EXPEDIENTE.minuta!.assunto}`,
  "",
  `Informação SGS ${DEMO_EXPEDIENTE.minuta!.numeroInformacao}`,
  "",
  DEMO_EXPEDIENTE.minuta!.vocativo,
  "",
  DEMO_EXPEDIENTE.minuta!.corpo,
  "",
  DEMO_EXPEDIENTE.minuta!.signatarios,
].join("\n");
