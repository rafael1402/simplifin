export interface Conta {
  id: string;
  tipo: string;
  descricao: string
  status: number;
}

export interface OpcaoConta {
  tipo: string,
  descricao: string
}

export interface ContaSheet {
  tipo: string;
  descricao: string
  status: string;
}
