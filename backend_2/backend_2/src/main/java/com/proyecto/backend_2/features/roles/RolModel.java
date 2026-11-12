package com.proyecto.backend_2.features.roles;

import java.util.Set;

import com.proyecto.backend_2.features.rolme.RolmeModel;
import com.proyecto.backend_2.features.usurol.UsurolModel;

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
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RolModel {
    @Id
    @Column(name = "codr", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codr;

    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "rolMenu")
    private Set<RolmeModel> menus;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "rolUsuario")
    private Set<UsurolModel> usuarios;
}