package com.proyecto.backend_2.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la pantalla B-9: ASIGNAR ROLES A UN USUARIO.
 * Representa un rol con un flag que indica si está asignado al usuario
 * seleccionado.
 */
@Data
@NoArgsConstructor
public class RolAsignadoDto {

    private Integer codr;
    private String nombre;
    private Boolean asignado; // TRUE si el rol está asignado al usuario, FALSE si no

    /**
     * Constructor para mapear desde Object[] (resultado de query nativa).
     * 
     * @param columns [codr, nombre, asignado]
     */
    public RolAsignadoDto(Object[] columns) {
        this.codr = (Integer) columns[0];
        this.nombre = (String) columns[1];
        this.asignado = (Boolean) columns[2];
    }
}
