export type Sistema = "SEI" | "CPA";

export type ExpedienteStatus =
  | "pdf"
  | "analise"
  | "rascunho"
  | "pronto";

export type ConfiancaDeteccao = "alta" | "media" | "baixa";

export type Diagnostico = {
  titulo: string;
  paginas: number | string;
  tipo: string;
  idioma: string;
  complexidade: string;
};

export type Insights = {
  tese: string;
  pontosChave: string[];
  dados: string[];
  termos: { termo: string; definicao: string }[];
  lacunas: string[];
};

export type Analise = {
  diagnostico: Diagnostico;
  mapaEstrutural: string;
  resumoExecutivo: string;
  resumoAnalitico: string;
  resumoDetalhado: string;
  insights: Insights;
  processadoPorPartes?: boolean;
  avisoTamanho?: string;
  criadoEm: string;
};

export type Marcacao = {
  tipo: "COMPLETAR" | "VERIFICAR";
  trecho: string;
  contexto: string;
};

export type Minuta = {
  processo: string;
  assunto: string;
  numeroInformacao: string;
  interessado: string;
  vocativo: string;
  corpo: string;
  signatarios: string;
  textoCompleto: string;
  marcacoes: Marcacao[];
  observacao?: string;
  criadoEm: string;
};

export type Deteccao = {
  sistema: Sistema;
  confianca: ConfiancaDeteccao;
  processo?: string;
  assunto?: string;
  sinais: string[];
  precisaConfirmar: boolean;
};

export type Expediente = {
  id: string;
  arquivoNome: string;
  pdfPath: string;
  textoExtraido: string;
  paginas: number;
  assunto: string;
  sistema: Sistema;
  sistemaConfirmado: boolean;
  deteccao: Deteccao;
  status: ExpedienteStatus;
  analise?: Analise;
  perguntas: { pergunta: string; resposta: string; em: string }[];
  posicionamento: string;
  informacoesAdicionais: string;
  minuta?: Minuta;
  demo?: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type UnitSettings = {
  vocativo: string;
  signatarios: string;
  prefixoInformacao: string;
  unidade: string;
  proximoNumeroSgs: string;
};
