package com.proyecto.backend_2.ids;

import java.io.Serializable;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Clave compuesta para la entidad ITEMAT
 * Codmat (FK a MATERIAS) + Codi (FK a ITEMS) + Gestion
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItematId implements Serializable {

    @Column(name = "codmat", nullable = false, length = 15)
    private String codmat;

    @Column(name = "codi", nullable = false)
    private Integer codi;

    @Column(name = "gestion", nullable = false)
    private Integer gestion;
}
