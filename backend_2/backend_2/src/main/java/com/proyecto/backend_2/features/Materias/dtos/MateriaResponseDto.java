package com.proyecto.backend_2.features.Materias.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para devolver una materia al frontend.
 * Incluye el nombre del nivel (en lugar del objeto completo).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaResponseDto {
    private String codmat;
    private String nombre;
    private Integer estado;
    private Integer codn; // ID del nivel
    private String nivelNombre; // Nombre del nivel (para mostrar en tabla)
}
