export interface Categoria {
  id: string;
  tipo: string;
  descricao: string
  status: number;
}

export interface OpcaoCategoria {
  tipo: string,
  descricao: string
}

export interface CategoriaSheet {
  tipo: string;
  descricao: string
  status: string;
}
