package com.proyecto.backend_2.core.auth.dtos;

import java.util.List;

import com.proyecto.backend_2.dtos.RolDto;
import com.proyecto.backend_2.features.personals.PersonalModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    PersonalModel persona;
    String token;
    List<RolDto> roles;
}
