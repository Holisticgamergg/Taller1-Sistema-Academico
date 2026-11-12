package com.proyecto.backend_2.features.Notas;

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
@Table(name = "notas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NotasModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codmat", nullable = false)
    private Integer codmat;

    @Column(name = "codi", nullable = false)
    private Integer codi;

    @Column(name = "coda", nullable = false)
    private Integer coda;

    @Column(name = "codp", nullable = false)
    private Integer codp;

    @Column(name = "codmatt", nullable = false)
    private Integer codmatt;

    @Column(name = "gestion", nullable = false)
    private Integer gestion;

    @Column(name = "login", nullable = false)
    private String login;

    @Column(name = "nota", nullable = false)
    private Double nota;

    @Column(name = "coddm", nullable = false)
    private Integer coddm;

}
