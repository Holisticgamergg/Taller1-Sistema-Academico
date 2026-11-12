export interface Materia {
  codmat: string;
  nombre: string;
  estado: number;
  codn: number;
}

export interface MateriaDto {
  codmat: string;
  nombre: string;
  codn: number;
}

// DTO para actualizar el código de la materia (cambio de PK)
export interface UpdateCodigoMateriaDto {
  oldCodmat: string;
  newCodmat: string;
  nombre: string;
  codn: number;
}
