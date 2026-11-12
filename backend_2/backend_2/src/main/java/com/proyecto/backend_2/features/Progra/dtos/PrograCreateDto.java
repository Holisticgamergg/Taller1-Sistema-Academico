package com.proyecto.backend_2.features.Progra.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva inscripción de alumno.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrograCreateDto {
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private Integer codp; // código del alumno
}
