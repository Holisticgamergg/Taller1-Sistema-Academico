package com.proyecto.backend_2.features.niveles;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.List;

import com.proyecto.backend_2.features.Materias.MateriasModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "niveles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class NivelesModel {
   @Id
   @Column(name = "codn", nullable = false)
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Integer codn;

   @Column(name = "nombre", nullable = false, length = 60)
   private String nombre;

   @Column(name = "estado", nullable = false)
   private Integer estado;

   @OneToMany(mappedBy = "nivel")
   private List<MateriasModel> materias;

}
