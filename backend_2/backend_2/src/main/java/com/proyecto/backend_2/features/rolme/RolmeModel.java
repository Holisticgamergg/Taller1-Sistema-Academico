package com.proyecto.backend_2.features.rolme;

import com.proyecto.backend_2.features.menus.MenuModel;
import com.proyecto.backend_2.features.roles.RolModel;
import com.proyecto.backend_2.ids.RolmeId;

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
@Table(name = "rolme")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RolmeModel {
    @EmbeddedId
    private RolmeId id;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @MapsId("codr")
    @JoinColumn(name = "codr")
    private RolModel rolMenu;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @MapsId("codm")
    @JoinColumn(name = "codm")
    private MenuModel menuRol;
}