package com.proyecto.backend_2.features.data;

import java.io.Serializable;

import com.proyecto.backend_2.features.personals.PersonalModel;
import com.proyecto.backend_2.ids.DataId;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "datos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataModel implements Serializable {
    @EmbeddedId
    private DataId id;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @OneToOne
    @MapsId("codp")
    @JoinColumn(name = "codp")
    private PersonalModel persona;
}