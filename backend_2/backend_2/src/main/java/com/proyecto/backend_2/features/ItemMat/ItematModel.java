package com.proyecto.backend_2.features.ItemMat;

import com.proyecto.backend_2.features.Items.ItemsModel;
import com.proyecto.backend_2.features.Materias.MateriasModel;
import com.proyecto.backend_2.ids.ItematId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad ITEMAT - Asignación de Items a Materias por gestión
 * Clave compuesta: codmat + codi + gestion
 */
@Entity
@Table(name = "itemat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItematModel {

    @EmbeddedId
    private ItematId id;

    @ManyToOne
    @MapsId("codmat")
    @JoinColumn(name = "codmat", nullable = false, insertable = false, updatable = false)
    private MateriasModel materia;

    @ManyToOne
    @MapsId("codi")
    @JoinColumn(name = "codi", nullable = false, insertable = false, updatable = false)
    private ItemsModel item;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Column(name = "ponderacion", nullable = false)
    private Integer ponderacion;
}
