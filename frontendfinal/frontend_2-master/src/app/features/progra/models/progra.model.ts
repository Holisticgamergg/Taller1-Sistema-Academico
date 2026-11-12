// Modelo completo de Inscripción (Progra)
export interface Progra {
  codmat: string;
  codpar: number;
  gestion: number;
  codp: number;
  estado: string;
  // Campos adicionales para visualización
  nombreNivel?: string;
  nombreMateria?: string;
  nombreAlumno?: string;
  nombreParalelo?: string;
}

// DTO para crear/actualizar inscripciones
export interface PrograCreateDto {
  codmat: string;
  codpar: number;
  gestion: number;
  codp: number;
  login: string
}

// DTO para estudiantes
export interface AlumnoDto {
  codp: number;
  nombre: string;
  ap: string;  // Apellido paterno
  am: string;  // Apellido materno
  nombreCompleto?: string;
}

// DTO para clases disponibles (reutilizado de Dicta)
export interface ClaseDisponibleDto {
  codmat: string;
  codpar: number;
  gestion: number;
  codn: number;
  nombreNivel: string;
  nombreMateria: string;
  nombreParalelo: string;
  claseKey: string; // "codmat-codpar-gestion"
  claseTexto: string; // "Primaria - Matemáticas - A"
}
