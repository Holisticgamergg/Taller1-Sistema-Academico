package com.proyecto.backend_2.features.mepro;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.backend_2.features.process.ProcessModel;
import com.proyecto.backend_2.ids.MeproId;

@Repository
public interface MeproRepository extends JpaRepository<MeproModel, MeproId> {
        @Query("SELECT p FROM ProcessModel p JOIN MeproModel mp ON mp.id.codp = p.codp WHERE mp.id.codm = :codm")
        List<ProcessModel> findByMenuCodm(@Param("codm") int codm);

        /**
         * 
         * * 'TODOS' = Muestra todos los procesos (asignados y no asignados)
         * * 'SI' = Solo procesos YA asignados al menú (mp.codm IS NOT NULL)
         * * 'NO' = Solo procesos NO asignados al menú (mp.codm IS NULL)
         * 
         * @param codm           Código del menú seleccionado
         * @param filtroNombre   Filtro opcional por nombre del proceso
         * @param tipoAsignacion Tipo de filtro: 'TODOS', 'SI', 'NO'
         * @return Lista de [codp, nombre, enlace, ayuda, asignado]
         */
        @Query(value = """
                        SELECT
                            p.codp,
                            p.nombre,
                            p.enlace,
                            p.ayuda,
                            (CASE WHEN mp.codm IS NOT NULL THEN TRUE ELSE FALSE END) AS asignado
                        FROM PROCESOS p
                        LEFT JOIN MEPRO mp ON p.codp = mp.codp AND mp.codm = :codm
                        WHERE
                            (CAST(:filtroNombre AS text) IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :filtroNombre, '%')))
                        AND (
                            (:tipoAsignacion = 'TODOS') OR
                            (:tipoAsignacion = 'SI' AND mp.codm IS NOT NULL) OR
                            (:tipoAsignacion = 'NO' AND mp.codm IS NULL)
                        )
                        ORDER BY p.nombre
                        """, nativeQuery = true)
        List<Object[]> getProcesosParaAsignar(
                        @Param("codm") Integer codm,
                        @Param("filtroNombre") String filtroNombre,
                        @Param("tipoAsignacion") String tipoAsignacion);

}
