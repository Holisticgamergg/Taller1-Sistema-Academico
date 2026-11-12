package com.proyecto.backend_2.features.Paralelos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "paralelos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ParalelosModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codpar", nullable = false)
    private Integer codpar;

    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

}
