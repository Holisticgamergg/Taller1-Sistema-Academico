package com.proyecto.backend_2.features.Materias.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para recibir datos al crear/actualizar una materia.
 * El usuario provee: codmat, nombre, codn (ID del nivel).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaRequestDto {
    private String codmat;
    private String nombre;
    private Integer codn; // FK al nivel
}
