package com.proyecto.backend_2.features.Dicta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el dropdown de clases disponibles en el formulario de asignación
 * docente.
 * Representa una clase (MAPA: Materia + Paralelo + Gestión).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaseDisponibleDto {
    private String codmat;
    private Integer codpar;
    private Integer gestion;

    /**
     * Descripción concatenada: "Nivel - Materia - Paralelo"
     * Ejemplo: "Primaria - Matemáticas - A"
     */
    private String descripcion;
}
