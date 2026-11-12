package com.proyecto.backend_2.features.General;

import com.proyecto.backend_2.features.users.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "general")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class GeneralModel {

    @Id
    @Column(name = "codg", nullable = false, length = 15)
    private String codg;

    @Column(name = "nombre", nullable = false)
    private Integer gestion;

    @Getter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "login")
    private UserModel usuario;

}
