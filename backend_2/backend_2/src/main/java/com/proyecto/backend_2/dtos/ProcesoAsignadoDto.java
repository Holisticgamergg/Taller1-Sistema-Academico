package com.proyecto.backend_2.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProcesoAsignadoDto {

    private Integer codp;
    private String nombre;
    private String enlace;
    private String ayuda;
    private Boolean asignado;

    public ProcesoAsignadoDto(Object[] columns) {
        this.codp = (Integer) columns[0];
        this.nombre = (String) columns[1];
        this.enlace = (String) columns[2];
        this.ayuda = (String) columns[3];
        this.asignado = (Boolean) columns[4];
    }

}
