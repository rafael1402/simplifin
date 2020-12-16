import { Validator } from '@angular/forms';
import { Categoria } from '../../cadastro/categoria/categoria-model';
import { Centro } from '../../cadastro/centro/centro-model';
import { Conta } from '../../cadastro/conta/conta-model';
import { FormaPagamento } from '../../cadastro/forma-pagamento/forma-pagamento-model';
import { Tag } from '../../cadastro/tag/tag-model';

export interface Despesa {
  _id: string;
  categoria: string;
  conta: string;
  formaPagamento: string;
  repeticaoTipo: string;
  repeticao: number;
  data: Date;
  baixado: number;
  valor: number;
  documento: string;
  descricao: string;
  observacao: string;
  centro: string;
  percentualRateio: number;
  valorRateio: number;
  tag: string[];
}

export interface DespesaFull {
  _id: string;
  categoria: Categoria;
  conta: Conta;
  formaPagamento: FormaPagamento;
  repeticaoTipo: string;
  repeticao: number;
  data: Date;
  vencimento: Date;
  baixado: number;
  valor: number;
  documento: string;
  descricao: string;
  observacao: string;
  centro: Centro;
  percentualRateio: number;
  valorRateio: number;
  tag: Tag[];
}

export interface DespesaSheet {
  data: String;
  conta: string;
  documento: string;
  descricao: string;
  formaPagamento: string;
  valor: number;
  baixado: string;
  categoria: string;
  observacao: string;
  centro: string;
  percentualRateio: number;
  valorRateio: number;
  tag: string;
}

export interface RepeticaoTipo {
  tipo: string;
  descricao: string;
}
