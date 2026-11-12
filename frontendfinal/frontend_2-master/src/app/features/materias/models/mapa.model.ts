export interface Mapa {
  codmat: string;
 codpar: number;
  gestion: number;
  // Nuevos campos planos
  nombreParalelo: string;
  estado: number;
}

export interface MapaDto {
  codmat: string;
  codpar: number;
}

export interface MapaId {
  codmat: string;
  codpar: number;
}
