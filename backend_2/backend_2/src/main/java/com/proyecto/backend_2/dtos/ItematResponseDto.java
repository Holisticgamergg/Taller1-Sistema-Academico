package com.proyecto.backend_2.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta para asignaciones Item-Materia
 * Incluye el nombre del item obtenido del JOIN con ITEMS
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItematResponseDto {
    // Campos de la PK
    private String codmat;
    private Integer codi;
    private Integer gestion;

    // Campos de la tabla y JOIN
    private String nombreItem; // Del JOIN con ITEMS
    private Integer ponderacion;
    private Integer estado;

    public ItematResponseDto(Object[] columns) {
        this.codmat = (String) columns[0];
        this.codi = (Integer) columns[1];
        this.gestion = (Integer) columns[2];
        this.nombreItem = (String) columns[3];
        this.ponderacion = (Integer) columns[4];
        this.estado = (Integer) columns[5];
    }
}
