package com.proyecto.backend_2.features.Progra;

import com.proyecto.backend_2.features.Mapa.MapaModel;
import com.proyecto.backend_2.features.personals.PersonalModel;
import com.proyecto.backend_2.ids.PrograId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Entidad PROGRA: Inscripción de Alumnos a una Clase
 * (Materia+Paralelo+Gestión).
 * Tabla de relación con clave compuesta.
 */
@Entity
@Table(name = "progra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PrograModel {

    @EmbeddedId
    private PrograId id;

    /**
     * Relación hacia MAPA (Clase: Materia+Paralelo+Gestión).
     */
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "codmat", referencedColumnName = "codmat", insertable = false, updatable = false),
            @JoinColumn(name = "codpar", referencedColumnName = "codpar", insertable = false, updatable = false),
            @JoinColumn(name = "gestion", referencedColumnName = "gestion", insertable = false, updatable = false)
    })
    private MapaModel clase;

    /**
     * Relación hacia PERSONAL (Alumno con tipo='E').
     */
    @ManyToOne
    @MapsId("codp")
    @JoinColumn(name = "codp", nullable = false)
    private PersonalModel alumno;

    /**
     * Login de quién registró la inscripción (auditoría).
     */
    @Column(name = "login", length = 10)
    private String login;

    /**
     * Estado de la inscripción: 1=Activo, 0=Inactivo.
     */
    @Column(name = "estado", nullable = false)
    private Integer estado;
}
