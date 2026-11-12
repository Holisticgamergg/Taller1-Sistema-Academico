package com.proyecto.backend_2.features.Materias;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository para MATERIAS
 * Query nativa para filtrado según pantalla B-12
 */
@Repository
public interface MateriasRepository extends JpaRepository<MateriasModel, String> {

  @Query(value = """
      SELECT * FROM materias m
      WHERE (CAST(:nombre AS text) IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
        AND (:estado = 2 OR m.estado = :estado)
      ORDER BY m.codmat
      """, nativeQuery = true)
  List<MateriasModel> findWithFiltersNative(@Param("nombre") String nombre, @Param("estado") Integer estado);

  @Modifying
  @Query(value = "UPDATE materias SET estado = :estado WHERE codmat = :codmat", nativeQuery = true)
  void changeState(@Param("codmat") String codmat, @Param("estado") Integer estado);

  @Modifying
  @Query(value = "UPDATE materias SET codmat = :newCodmat WHERE codmat = :oldCodmat", nativeQuery = true)
  void updateCodmat(@Param("oldCodmat") String oldCodmat, @Param("newCodmat") String newCodmat);

  boolean existsByCodmat(String codmat);

}