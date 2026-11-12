package com.proyecto.backend_2.features.Modalidad;

import lombok.AccessLevel;

import com.proyecto.backend_2.features.DModalidad.DModalidadModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Modalidad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class ModalidadModel {

    @Id
    @Column(name = "codm", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codm;

    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "coddm")
    private DModalidadModel dmodalidad;
}
