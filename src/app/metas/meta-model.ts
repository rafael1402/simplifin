import { Categoria } from '../cadastro/categoria/categoria-model';

export interface Meta {
  _id: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  metaItens: MetaItem[]
}

export interface MetaItem {
  _id: string;
  categoria: string;
  valor: number
}

export interface MetaAcompanhamento {
  categoria: Categoria;
  valor: number;
  totalDespesa: number;
  percentualMeta: number

}

export interface MetaItemRet {
  _id: string;
  categoria: string;
  valor: number
}
