export interface Itemat {
  codmat: string;
  codi: number;
  gestion: number;
  // Nuevos campos planos (coinciden con el backend)
  nombreItem: string; 
  ponderacion: number;
  estado: number;
}

export interface ItematDto {
  codmat: string;
  codi: number;
  ponderacion: number;
}

export interface ItematId {
  codmat: string;
  codi: number;
}
