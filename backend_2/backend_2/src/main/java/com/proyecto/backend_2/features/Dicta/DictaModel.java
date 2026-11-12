package com.proyecto.backend_2.features.Dicta;

import com.proyecto.backend_2.features.Mapa.MapaModel;
import com.proyecto.backend_2.features.users.UserModel;
import com.proyecto.backend_2.ids.DictaId;

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
 * Entidad DICTA: Asignación de un Profesor a una Clase
 * (Materia+Paralelo+Gestión).
 * Tabla de relación con clave compuesta.
 */
@Entity
@Table(name = "dicta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DictaModel {

    @EmbeddedId
    private DictaId id;

    /**
     * Relación hacia MAPA (Clase: Materia+Paralelo+Gestión).
     * 
     * @MapsId mapea los campos codmat, codpar, gestion de DictaId.
     */
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "codmat", referencedColumnName = "codmat", insertable = false, updatable = false),
            @JoinColumn(name = "codpar", referencedColumnName = "codpar", insertable = false, updatable = false),
            @JoinColumn(name = "gestion", referencedColumnName = "gestion", insertable = false, updatable = false)
    })
    private MapaModel clase;

    /**
     * Relación hacia USUARIOS (Profesor).
     * 
     * @MapsId mapea el campo login de DictaId.
     */
    @ManyToOne
    @MapsId("login")
    @JoinColumn(name = "login", nullable = false)
    private UserModel profesor;

    /**
     * Estado de la asignación: 1=Activo, 0=Inactivo.
     */
    @Column(name = "estado", nullable = false)
    private Integer estado;
}
