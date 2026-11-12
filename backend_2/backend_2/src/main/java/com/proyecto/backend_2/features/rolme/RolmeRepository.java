package com.proyecto.backend_2.features.rolme;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.backend_2.features.menus.MenuModel;
import com.proyecto.backend_2.ids.RolmeId;

@Repository
public interface RolmeRepository extends JpaRepository<RolmeModel, RolmeId> {

    /**
     * Query legacy (mantener por compatibilidad).
     */
    @Query("SELECT m FROM RolmeModel rm JOIN MenuModel m ON rm.id.codm = m.codm WHERE rm.id.codr = :rol")
    List<MenuModel> findMenuByRol(@Param("rol") int rol);

    /**
     * B-8. ASIGNAR MENÚS A UN ROL - Obtener menús para asignar a un rol.
     * 
     * Esta query lista TODOS los menús con un flag "asignado" que indica
     * si están o no asignados al rol seleccionado (codr).
     * 
     * Filtros:
     * - filtroNombre: Busca menús por nombre (case-insensitive, parcial)
     * - tipoAsignacion:
     * * 'TODOS' = Muestra todos los menús (asignados y no asignados)
     * * 'SI' = Solo menús YA asignados al rol (rm.codr IS NOT NULL)
     * * 'NO' = Solo menús NO asignados al rol (rm.codr IS NULL)
     * 
     * @param codr           Código del rol seleccionado
     * @param filtroNombre   Filtro opcional por nombre del menú
     * @param tipoAsignacion Tipo de filtro: 'TODOS', 'SI', 'NO'
     * @return Lista de [codm, nombre, asignado]
     */
    @Query(value = """
            SELECT
                m.codm,
                m.nombre,
                (CASE WHEN rm.codr IS NOT NULL THEN TRUE ELSE FALSE END) AS asignado
            FROM MENUS m
            LEFT JOIN ROLME rm ON m.codm = rm.codm AND rm.codr = :codr
            WHERE
                (CAST(:filtroNombre AS text) IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :filtroNombre, '%')))
            AND (
                (:tipoAsignacion = 'TODOS') OR
                (:tipoAsignacion = 'SI' AND rm.codr IS NOT NULL) OR
                (:tipoAsignacion = 'NO' AND rm.codr IS NULL)
            )
            ORDER BY m.nombre
            """, nativeQuery = true)
    List<Object[]> getMenusParaAsignar(
            @Param("codr") Integer codr,
            @Param("filtroNombre") String filtroNombre,
            @Param("tipoAsignacion") String tipoAsignacion);
}
