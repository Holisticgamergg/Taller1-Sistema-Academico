package com.proyecto.backend_2.features.Materias;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.proyecto.backend_2.features.niveles.NivelesModel;

import jakarta.persistence.Column;

import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

@Entity
@Table(name = "materias")

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MateriasModel {
    @Id

    @Column(name = "codmat", nullable = false, length = 15)
    private String codmat;

    @Column(name = "nombre", nullable = false, length = 30)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Column(name = "codn", insertable = false, updatable = false)
    private Integer codn;

    @ManyToOne
    @JoinColumn(name = "codn")
    @JsonIgnore
    private NivelesModel nivel;

}