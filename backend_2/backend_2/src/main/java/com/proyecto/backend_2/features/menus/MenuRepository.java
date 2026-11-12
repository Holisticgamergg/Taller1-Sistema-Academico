package com.proyecto.backend_2.features.menus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.backend_2.dtos.ProcessDto;

@Repository
public interface MenuRepository extends JpaRepository<MenuModel, Integer> {

        // --- Query para B-6.3 y B-6.4 (Eliminar/Habilitar) ---
        // ¡Esta ya estaba perfecta!
        @Modifying
        @Query(value = "update menus set estado = :state where codm = :id;", nativeQuery = true)
        void changeState(@Param("id") Integer id, @Param("state") Integer state);

        // --- Query para B-8 (Asignar Menús a Rol) ---
        // ¡Esta ya estaba perfecta!
        @Query(value = "select m.* from menus m join rolme rm on rm.codm = m.codm where rm.codr = :xcodr", nativeQuery = true)
        List<MenuModel> getMenusRol(@Param("xcodr") Integer xcodr);

        // --- Query para B-7 (Asignar Procesos a Menú) ---
        // ¡Esta ya estaba perfecta!
        @Query(value = "select p.nombre as nombre,p.ayuda as ayuda, p.enlace as enlace from procesos p"
                        + " join mepro mp on mp.codp = p.codp where mp.codm = :xcodm", nativeQuery = true)
        List<ProcessDto> getProcesosMenu(@Param("xcodm") Integer xcodm);

        // --- Query para B-6 (Gestión Menús - Filtros) ---
        /**
         * CORREGIDO: Query NATIVA para la pantalla B-6.
         * 1. Se cambió 'select m from menus m' por 'SELECT * FROM menus m'.
         * 2. Se añadió manejo de nulos para ':nombre' (con CAST Y COALESCE)
         * para evitar el error 500 en GET.
         */
        @Query(value = "SELECT * FROM menus m WHERE " +
                        "(CAST(:nombre AS text) IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', CAST(:nombre AS text), '%'))) "
                        +
                        "AND (:estado = 2 OR m.estado = :estado)", nativeQuery = true)
        List<MenuModel> findWithFiltersNative( // Renombrado para más claridad
                        @Param("nombre") String nombre,
                        @Param("estado") Integer estado);
}