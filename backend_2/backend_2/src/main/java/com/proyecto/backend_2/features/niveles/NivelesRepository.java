package com.proyecto.backend_2.features.niveles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NivelesRepository extends JpaRepository<NivelesModel, Integer> {

  /**
   * B-13. Búsqueda con filtros usando query nativa.
   * 
   * @param nombre Filtro por nombre (null = todos)
   * @param estado Filtro por estado (2 = todos, 1 = activos, 0 = inactivos)
   * @return Lista de niveles filtrados
   */
  @Query(value = """
      SELECT * FROM niveles n
      WHERE (CAST(:nombre AS VARCHAR) IS NULL OR LOWER(n.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
        AND (:estado = 2 OR n.estado = :estado)
      ORDER BY n.nombre
      """, nativeQuery = true)
  List<NivelesModel> findWithFiltersNative(@Param("nombre") String nombre, @Param("estado") Integer estado);

  /**
   * B-13.3 y B-13.4. Cambio de estado (eliminación lógica o habilitación).
   * 
   * @param codn   ID del nivel
   * @param estado Nuevo estado (0 = inactivo, 1 = activo)
   */
  @Modifying
  @Query(value = "UPDATE niveles SET estado = :estado WHERE codn = :codn", nativeQuery = true)
  void changeState(@Param("codn") Integer codn, @Param("estado") Integer estado);

  /**
   * Verificar si existe un nivel con el mismo nombre (case insensitive).
   * 
   * @param nombre Nombre a verificar
   * @return true si existe
   */
  @Query(value = "SELECT COUNT(*) > 0 FROM niveles WHERE LOWER(nombre) = LOWER(:nombre)", nativeQuery = true)
  boolean existsByNombreIgnoreCase(@Param("nombre") String nombre);

  /**
   * Verificar si existe un nivel con el mismo nombre excluyendo un ID específico.
   * 
   * @param nombre Nombre a verificar
   * @param codn   ID a excluir
   * @return true si existe otro nivel con ese nombre
   */
  @Query(value = "SELECT COUNT(*) > 0 FROM niveles WHERE LOWER(nombre) = LOWER(:nombre) AND codn != :codn", nativeQuery = true)
  boolean existsByNombreAndNotId(@Param("nombre") String nombre, @Param("codn") Integer codn);

  /**
   * Listar solo los niveles activos (para dropdowns).
   * 
   * @return Lista de niveles con estado = 1
   */
  @Query(value = "SELECT * FROM niveles WHERE estado = 1 ORDER BY nombre", nativeQuery = true)
  List<NivelesModel> findAllActivos();
}
