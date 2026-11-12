package com.proyecto.backend_2.features.Dicta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de asignaciones docentes (DICTA).
 * Incluye información completa con nombres legibles para visualización.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictaResponseDto {
    // IDs de la clave compuesta
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private String login;

    // Datos visuales (nombres legibles obtenidos mediante JOINs)
    private String nombreNivel;
    private String nombreMateria;
    private String nombreParalelo;
    private String nombreProfesor; // nombre + ap del profesor

    // Estado de la asignación
    private Integer estado;
}
