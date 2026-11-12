package com.proyecto.backend_2.ids;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clave compuesta para la entidad DICTA (Asignación Docente).
 * Relaciona: Clase (MAPA: Materia+Paralelo+Gestión) con Profesor (login).
 */
@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictaId implements Serializable {
    private String codmat;
    private Integer codpar;
    private Integer gestion;
    private String login;
}