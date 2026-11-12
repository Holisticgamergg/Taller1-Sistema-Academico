package com.proyecto.backend_2.ids;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor

public class NotaId implements java.io.Serializable {
    private String codmat;
    private Integer codp;
    private Integer codi;
    private Integer gestion;
}
