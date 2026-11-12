package com.proyecto.backend_2.features.usurol;

import com.proyecto.backend_2.features.roles.RolModel;
import com.proyecto.backend_2.features.users.UserModel;
import com.proyecto.backend_2.ids.UsurolId;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usurol")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsurolModel {
    @EmbeddedId
    private UsurolId id;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @MapsId("login")
    @JoinColumn(name = "login")
    private UserModel usuarioRol;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @MapsId("codr")
    @JoinColumn(name = "codr")
    private RolModel rolUsuario;
}