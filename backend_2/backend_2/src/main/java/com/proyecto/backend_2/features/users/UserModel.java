package com.proyecto.backend_2.features.users;

import com.proyecto.backend_2.features.General.GeneralModel;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.proyecto.backend_2.features.personals.PersonalModel;
import com.proyecto.backend_2.features.usurol.UsurolModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {})
@Builder
public class UserModel implements UserDetails {
    @Id
    @Column(name = "login", nullable = false, length = 10)
    @EqualsAndHashCode.Include
    private String login;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @JsonIgnore
    @Column(name = "password", nullable = false, length = 200)
    private String password;

    @Getter(AccessLevel.NONE)
    @OneToOne
    @JoinColumn(name = "codp")
    private PersonalModel person;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuarioRol")
    private Set<UsurolModel> roles;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario") // CORREGIDO: OneToMany en lugar de OneToOne, y mappedBy debe coincidir con el
                                     // campo en GeneralModel
    private Set<GeneralModel> generales;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public String getPassword() {
        return this.password;
    }
}
