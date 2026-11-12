package com.proyecto.backend_2.features.process;

import java.util.Set;

import com.proyecto.backend_2.features.mepro.MeproModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "procesos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProcessModel {
    @Id
    @Column(name = "codp", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codp;

    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;

    @Column(name = "enlace", nullable = false, length = 40)
    private String enlace;

    @Column(name = "ayuda", length = 50)
    private String ayuda;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "procesoMenu")
    private Set<MeproModel> menus;
}
