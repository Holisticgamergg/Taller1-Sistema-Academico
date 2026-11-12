package com.proyecto.backend_2.features.Progra.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el dropdown de alumnos en el formulario de inscripción.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoDto {
    private Integer codp;
    private String nombreCompleto; // "Nombre Apellido Apellido"
}
