package com.proyecto.backend_2.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la pantalla B-8: ASIGNAR MENÚS A UN ROL.
 * Representa un menú con un flag que indica si está asignado al rol
 * seleccionado.
 */
@Data
@NoArgsConstructor
public class MenuAsignadoDto {

    private Integer codm;
    private String nombre;
    private Boolean asignado; // TRUE si el menú está asignado al rol, FALSE si no

    /**
     * Constructor para mapear desde Object[] (resultado de query nativa).
     * 
     * @param columns [codm, nombre, asignado]
     */
    public MenuAsignadoDto(Object[] columns) {
        this.codm = (Integer) columns[0];
        this.nombre = (String) columns[1];
        this.asignado = (Boolean) columns[2];
    }
}
