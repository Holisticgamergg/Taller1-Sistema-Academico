package com.proyecto.backend_2.features.Dicta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva asignación docente.
 * Contiene los IDs necesarios para la clave compuesta de DICTA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictaCreateDto {
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private String login; // login del profesor
}
