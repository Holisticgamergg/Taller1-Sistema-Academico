package com.proyecto.backend_2.features.Progra.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para app móvil - Materias inscritas de un alumno.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaMovilDto {
    private String codmat; // Código de la materia
    private String sigla; // Sigla de la materia
    private String materia; // Nombre completo de la materia
    private String nivel; // Nivel (ej: "1", "2")
    private String paralelo; // Paralelo (ej: "1", "2" para A, B)
}
