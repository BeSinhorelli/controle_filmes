export enum Status {
  QUERO_ASSISTIR = 'QUERO_ASSISTIR',
  ASSISTINDO = 'ASSISTINDO',
  ASSISTIDO = 'ASSISTIDO'
}

export interface Filme {
  id: number;
  titulo: string;
  diretor: string;
  genero: string;
  ano: number;
  nota: number;
  status: Status;
  sinopse: string;
  createdAt: Date;
}

export interface FilmeCreateInput {
  titulo: string;
  diretor: string;
  genero: string;
  ano: number;
  nota: number;
  status: Status;
  sinopse: string;
}

export interface FilmeUpdateInput {
  titulo?: string;
  diretor?: string;
  genero?: string;
  ano?: number;
  nota?: number;
  status?: Status;
  sinopse?: string;
}