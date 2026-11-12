package com.proyecto.backend_2.core.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class RegisterRequest {
    String login;
    Integer estado;
    String password;
    Integer codp;
}
