package com.proyecto.backend_2.features.Mapa;

import com.proyecto.backend_2.features.Materias.MateriasModel;
import com.proyecto.backend_2.features.Paralelos.ParalelosModel;
import com.proyecto.backend_2.ids.MapaId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "mapa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MapaModel {

    @EmbeddedId
    private MapaId id;

    @ManyToOne
    @MapsId("codmat")
    @JoinColumn(name = "codmat", nullable = false)
    private MateriasModel materias;

    @ManyToOne
    @MapsId("codpar")
    @JoinColumn(name = "codpar", nullable = false)
    private ParalelosModel paralelos;

    @Column(name = "estado", nullable = false)
    private Integer estado;
}
