export interface Dicta {
  codmat: string;
  codpar: number;
  gestion: number;
  login: string;
  estado: number;
  nombreNivel?: string;
  nombreMateria?: string;
  nombreProfesor?: string;
  nombreParalelo?: string;
}

export interface DictaCreateDto {
  codmat: string;
  codpar: number;
  gestion: number;
  login: string;
}

export interface ClaseDisponibleDto {
  codmat: string;
  codpar: number;
  gestion: number;
  nombreNivel: string;
  nombreMateria: string;
  nombreParalelo: string;
  displayText?: string; // "Primaria - Matematicas - A"
}
