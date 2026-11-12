package com.proyecto.backend_2.features.personals;

import java.time.LocalDate;

import com.proyecto.backend_2.features.data.DataModel;
import com.proyecto.backend_2.features.users.UserModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "personal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PersonalModel {
    @Id
    @Column(name = "codp", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codp;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "ap", length = 40)
    private String ap;

    @Column(name = "am", length = 40)
    private String am;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Column(name = "fnac", nullable = false)
    private LocalDate fnac;

    @Column(name = "ecivil", nullable = false, length = 1)
    private String ecivil;

    @Column(name = "genero", nullable = false, length = 1)
    private String genero;

    @Column(name = "direc", length = 50)
    private String direc;

    @Column(name = "telf", length = 20)
    private String telf;

    @Column(name = "tipo", nullable = false, length = 1)
    private String tipo;

    @Column(name = "foto")
    private String foto;

    @OneToOne(mappedBy = "person")
    private UserModel user;

    @OneToOne(mappedBy = "persona")
    private DataModel datos;
}