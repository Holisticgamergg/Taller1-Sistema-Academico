package com.proyecto.backend_2.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear/asignar una relación Materia-Paralelo (MAPA).
 * La gestión se obtiene automáticamente desde la tabla GENERAL.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MapaCreateDto {
    private String codmat; // FK a MATERIAS
    private Integer codpar; // FK a PARALELOS
    // gestion se obtiene automáticamente desde GENERAL
}
