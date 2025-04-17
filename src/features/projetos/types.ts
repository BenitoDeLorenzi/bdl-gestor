import { Models } from "node-appwrite";

export enum ProjetosFinanceTipo {
  ENTRADA = "ENTRADA",
  SAIDA = "SAIDA",
}

export enum ProjetosFinanceFormaPagamento {
  DINHEIRO = "DINHEIRO",
  CARTAO_CREDITO = "CARTAO_CREDITO",
  CARTAO_DEBITO = "CARTAO_DEBITO",
  PIX = "PIX",
  TRANSFERENCIA = "TRANSFERENCIA",
  PAGAMENTO = "PAGAMENTO",
}

export const formaPagamentoLabels: Record<
  ProjetosFinanceFormaPagamento,
  string
> = {
  [ProjetosFinanceFormaPagamento.DINHEIRO]: "Dinheiro",
  [ProjetosFinanceFormaPagamento.CARTAO_CREDITO]: "Cartão de Crédito",
  [ProjetosFinanceFormaPagamento.CARTAO_DEBITO]: "Cartão de Débito",
  [ProjetosFinanceFormaPagamento.PIX]: "Pix",
  [ProjetosFinanceFormaPagamento.TRANSFERENCIA]: "Transferência Bancária",
  [ProjetosFinanceFormaPagamento.PAGAMENTO]: "Pagamento",
};

export enum ProjetosFinanceStatus {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
  CANCELADO = "CANCELADO",
}

export type Projetos = Models.Document & {
  nome: string;
};

export type ProjetosFinance = Models.Document & {
  projeto_id: string;
  tipo: ProjetosFinanceTipo;
  descricao: string;
  valor: number;
  data: string;
  forma_pagamento: ProjetosFinanceFormaPagamento;
  status: ProjetosFinanceStatus;
  user_id: string;
  obecervacoes: string;
  categoria: string;
};

export type ProjetosMessages = Models.Document & {
  tipo: string;
  razao_social: string;
  cnpj: string;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  telefone: string;
  representante_nome: string;
  representante_cpf: string;
  box: string[];
  termos: boolean;
  email: string;
  projeto: string;
};

export type ProjetosCategorias = Models.Document & {
  projeto_id: string;
  nome: string;
};
