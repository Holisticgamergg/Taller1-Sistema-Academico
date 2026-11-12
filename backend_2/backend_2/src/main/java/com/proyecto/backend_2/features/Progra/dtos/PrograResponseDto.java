package com.proyecto.backend_2.features.Progra.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de inscripciones de alumnos (PROGRA).
 * Incluye información completa con nombres legibles para visualización.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrograResponseDto {
    // IDs de la clave compuesta
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private Integer codp;

    // Datos visuales (nombres legibles obtenidos mediante JOINs)
    private String nombreNivel;
    private String nombreMateria;
    private String nombreParalelo;
    private String nombreAlumno; // nombre completo del alumno

    // Estado de la inscripción
    private Integer estado;
}
