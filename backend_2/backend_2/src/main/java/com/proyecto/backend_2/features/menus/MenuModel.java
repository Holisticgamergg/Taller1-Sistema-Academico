package com.proyecto.backend_2.features.menus;

import java.util.Set;

import com.proyecto.backend_2.features.mepro.MeproModel;
import com.proyecto.backend_2.features.rolme.RolmeModel;

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
@Table(name = "menus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MenuModel {
    @Id
    @Column(name = "codm", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codm;

    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "menuProceso")
    private Set<MeproModel> procesos;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "menuRol")
    private Set<RolmeModel> roles;
}
