package com.proyecto.backend_2.features.mepro;

import com.proyecto.backend_2.features.menus.MenuModel;
import com.proyecto.backend_2.features.process.ProcessModel;
import com.proyecto.backend_2.ids.MeproId;

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
@Table(name = "mepro")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeproModel {
    @EmbeddedId
    private MeproId id;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @MapsId("codm")
    @JoinColumn(name = "codm")
    private MenuModel menuProceso;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @MapsId("codp")
    @JoinColumn(name = "codp")
    private ProcessModel procesoMenu;
}
