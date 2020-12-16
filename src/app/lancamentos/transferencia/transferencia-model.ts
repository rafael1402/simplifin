import { Categoria } from '../../cadastro/categoria/categoria-model';
import { Conta } from '../../cadastro/conta/conta-model';
import { Tag } from '../../cadastro/tag/tag-model';

export interface Transferencia {
  _id: string;
  contaOrigem: string;
  contaDestino: string;
  repeticaoTipo: string;
  repeticao: number;
  data: Date;
  valor: number;
  documento: string;
  descricao: string;
  observacao: string;
  tag: string[];
}

export interface TransferenciaFull {
  _id: string;
  contaOrigem: Conta;
  contaDestino: Conta;
  repeticaoTipo: string;
  repeticao: number;
  data: Date;
  valor: number;
  documento: string;
  descricao: string;
  observacao: string;
  tag: Tag[];
}

export interface TransferenciaSheet {
  data: String;
  contaOrigem: string;
  contaDestino: string;
  documento: string;
  descricao: string;
  valor: number;
  observacao: string;
  tag: string;
}

export interface RepeticaoTipo {
  tipo: string;
  descricao: string;
}
