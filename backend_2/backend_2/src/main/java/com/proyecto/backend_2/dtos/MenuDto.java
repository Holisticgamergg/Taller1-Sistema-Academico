package com.proyecto.backend_2.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDto {
    private Integer codm;
    private String nombre;
    List<ProcessDto> procesos;
}
