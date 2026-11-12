package com.proyecto.backend_2.features.Items;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsRepository extends JpaRepository<ItemsModel, Integer> {

    /**
     * B-11. Búsqueda con filtros usando query nativa.
     * 
     * @param nombre Filtro por nombre (null = todos)
     * @param estado Filtro por estado (2 = todos, 1 = activos, 0 = inactivos)
     * @return Lista de items filtrados
     */
    @Query(value = """
            SELECT * FROM items i
            WHERE (CAST(:nombre AS text) IS NULL OR LOWER(i.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
              AND (:estado = 2 OR i.estado = :estado)
            ORDER BY i.nombre
            """, nativeQuery = true)
    List<ItemsModel> findWithFiltersNative(@Param("nombre") String nombre, @Param("estado") Integer estado);

    /**
     * B-11. Cambio de estado (eliminación lógica o habilitación).
     * 
     * @param codi   ID del item
     * @param estado Nuevo estado (0 = inactivo, 1 = activo)
     */
    @Modifying
    @Query(value = "UPDATE items SET estado = :estado WHERE codi = :codi", nativeQuery = true)
    void changeState(@Param("codi") Integer codi, @Param("estado") Integer estado);

    /**
     * Verificar si existe un item con el mismo nombre (case insensitive).
     * 
     * @param nombre Nombre a verificar
     * @return true si existe
     */
    @Query(value = "SELECT COUNT(*) > 0 FROM items WHERE LOWER(nombre) = LOWER(:nombre)", nativeQuery = true)
    boolean existsByNombreIgnoreCase(@Param("nombre") String nombre);

    /**
     * Verificar si existe un item con el mismo nombre excluyendo un ID específico.
     * 
     * @param nombre Nombre a verificar
     * @param codi   ID a excluir
     * @return true si existe otro item con ese nombre
     */
    @Query(value = "SELECT COUNT(*) > 0 FROM items WHERE LOWER(nombre) = LOWER(:nombre) AND codi != :codi", nativeQuery = true)
    boolean existsByNombreAndNotId(@Param("nombre") String nombre, @Param("codi") Integer codi);

    /**
     * Listar solo los items activos (para dropdowns).
     * 
     * @return Lista de items con estado = 1
     */
    @Query(value = "SELECT * FROM items WHERE estado = 1 ORDER BY nombre", nativeQuery = true)
    List<ItemsModel> findAllActivos();
}