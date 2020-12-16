import { Categoria } from '../../cadastro/categoria/categoria-model';
import { Conta } from '../../cadastro/conta/conta-model';
import { Tag } from '../../cadastro/tag/tag-model';

export interface Receita {
  _id: string;
  categoria: string;
  conta: string;
  repeticaoTipo: string;
  repeticao: number;
  data: Date;
  valor: number;
  documento: string;
  descricao: string;
  observacao: string;
  tag: string[];
}

export interface ReceitaFull {
  _id: string;
  categoria: Categoria;
  conta: Conta;
  repeticaoTipo: string;
  repeticao: number;
  data: Date;
  valor: number;
  documento: string;
  descricao: string;
  observacao: string;
  tag: Tag[];
}

export interface ReceitaSheet {
  data: String;
  conta: string;
  documento: string;
  descricao: string;
  valor: number;
  categoria: string;
  observacao: string;
  tag: string;
}

export interface RepeticaoTipo {
  tipo: string;
  descricao: string;
}
