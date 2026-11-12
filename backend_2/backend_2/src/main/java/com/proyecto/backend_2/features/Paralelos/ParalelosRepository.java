package com.proyecto.backend_2.features.Paralelos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParalelosRepository extends JpaRepository<ParalelosModel, Integer> {

    /**
     * Query nativa para filtrar paralelos por nombre y estado.
     * Si estado = 2, retorna todos los registros independientemente del estado.
     * Si estado = 0 o 1, filtra por ese estado específico.
     * El nombre se filtra con LIKE para búsqueda parcial (case insensitive).
     */
    @Query(value = """
            SELECT * FROM paralelos p
            WHERE (CAST(:nombre AS text) IS NULL OR LOWER(CAST(p.nombre AS text)) LIKE LOWER(CONCAT('%', CAST(:nombre AS text), '%')))
              AND (:estado = 2 OR p.estado = :estado)
            ORDER BY p.codpar
            """, nativeQuery = true)
    List<ParalelosModel> findByFiltros(@Param("nombre") String nombre, @Param("estado") Integer estado);

}