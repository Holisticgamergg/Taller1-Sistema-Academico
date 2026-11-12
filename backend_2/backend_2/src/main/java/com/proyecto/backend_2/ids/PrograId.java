package com.proyecto.backend_2.ids;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clave compuesta para la entidad PROGRA (Inscripción de Alumnos).
 * Relaciona: Clase (MAPA: Materia+Paralelo+Gestión) con Alumno (codp).
 */
@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrograId implements Serializable {
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private Integer codp; // código del alumno
}
