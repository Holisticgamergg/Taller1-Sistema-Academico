package com.proyecto.backend_2.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para devolver datos de una relación Materia-Paralelo (MAPA).
 * Incluye el nombre del paralelo desde el JOIN.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MapaResponseDto {
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private String nombreParalelo; // Obtenido desde JOIN con PARALELOS
    private Integer estado;
}
