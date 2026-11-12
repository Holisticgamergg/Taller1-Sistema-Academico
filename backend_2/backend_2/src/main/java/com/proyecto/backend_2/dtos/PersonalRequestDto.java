package com.proyecto.backend_2.dtos;

import com.proyecto.backend_2.features.personals.PersonalModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonalRequestDto {
    private PersonalModel persona;
    private String cedula;
}
