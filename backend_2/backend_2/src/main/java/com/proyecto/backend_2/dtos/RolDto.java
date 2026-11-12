package com.proyecto.backend_2.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RolDto {
    private Integer codr;
    private String nombre;
    private Integer estado;
    private List<MenuDto> menus;
}
