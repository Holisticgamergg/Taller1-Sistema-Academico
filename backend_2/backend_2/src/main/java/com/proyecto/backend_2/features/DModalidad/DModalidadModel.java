package com.proyecto.backend_2.features.DModalidad;

import java.util.Set;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import com.proyecto.backend_2.features.Modalidad.ModalidadModel;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "dmodalidad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DModalidadModel {
    @Id
    @Column(name = "coddm", nullable = false, length = 15)
    private String coddm;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "dmodalidad") // CORREGIDO: debe coincidir con el nombre del campo en ModalidadModel
    private Set<ModalidadModel> modalidades;
}
