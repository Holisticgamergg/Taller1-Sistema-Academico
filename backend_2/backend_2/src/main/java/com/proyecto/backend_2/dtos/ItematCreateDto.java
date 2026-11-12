package com.proyecto.backend_2.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear o actualizar asignaciones Item-Materia.
 * La gestión se obtiene automáticamente desde la tabla GENERAL.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItematCreateDto {
    private String codmat;
    private Integer codi;
    private Integer ponderacion;
    // gestion se obtiene automáticamente desde GENERAL
}
