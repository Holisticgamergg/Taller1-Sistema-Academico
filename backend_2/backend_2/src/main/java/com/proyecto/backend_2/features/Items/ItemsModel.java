package com.proyecto.backend_2.features.Items;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class ItemsModel {
    @Id
    @Column(name = "codi", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codi;

    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

}
