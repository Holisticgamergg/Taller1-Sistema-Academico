package com.proyecto.backend_2.features.roles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<RolModel, Integer> {

        /**
         * QUERY MAESTRA: Maneja Filtro por Nombre + Filtro por Estado + Paginación.
         * COALESCE(:nombre, '') hace que si el nombre es null, no rompa la query.
         * :estado = 2 funciona como comodín para "Todos".
         */
        @Query(value = "SELECT * FROM roles r WHERE " +
                        "(CAST(:nombre AS text) IS NULL OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', CAST(:nombre AS text), '%'))) "
                        +
                        "AND (:estado = 2 OR r.estado = :estado)", countQuery = "SELECT count(*) FROM roles r WHERE " +
                                        "(CAST(:nombre AS text) IS NULL OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', CAST(:nombre AS text), '%'))) "
                                        +
                                        "AND (:estado = 2 OR r.estado = :estado)", nativeQuery = true)
        Page<RolModel> searchRoles(
                        @Param("nombre") String nombre,
                        @Param("estado") Integer estado,
                        Pageable pageable);

        // Validaciones para POST y PUT
        boolean existsByNombre(String nombre);

        @Query(value = "SELECT COUNT(*) > 0 FROM roles WHERE nombre = :nombre AND codr != :id", nativeQuery = true)
        boolean existsByNombreAndNotId(@Param("nombre") String nombre, @Param("id") Integer id);

        // Cambio de estado (B5.3 y B5.4)
        @Modifying
        @Query(value = "UPDATE roles SET estado = :state WHERE codr = :id", nativeQuery = true)
        void changeState(@Param("id") Integer id, @Param("state") Integer state);
}