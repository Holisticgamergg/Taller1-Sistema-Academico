package com.proyecto.backend_2.features.Mapa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.ids.MapaId;

import java.util.List;

@Repository
public interface MapaRepository extends JpaRepository<MapaModel, MapaId> {

  /**
   * B-12.1. Obtener todos los paralelos asignados a una materia en una gestión
   * específica.
   * Hace JOIN con PARALELOS para obtener el nombre del paralelo.
   * 
   * @param codmat  Código de la materia
   * @param gestion Año de gestión
   * @return Lista de [codmat, codpar, gestion, nombreParalelo, estado]
   */
  @Query(value = """
      SELECT
          m.codmat,
          m.codpar,
          m.gestion,
          p.nombre,
          m.estado
      FROM mapa m
      INNER JOIN paralelos p ON m.codpar = p.codpar
      WHERE m.codmat = :codmat
        AND m.gestion = :gestion
      ORDER BY m.codpar
      """, nativeQuery = true)
  List<Object[]> findParalelosAsignadosNative(
      @Param("codmat") String codmat,
      @Param("gestion") Integer gestion);

  /**
   * Cambiar el estado de una asignación Materia-Paralelo.
   * Usado para eliminación lógica (estado=0) o habilitación (estado=1).
   */
  @Modifying
  @Transactional
  @Query(value = """
      UPDATE mapa
      SET estado = :estado
      WHERE codmat = :codmat
        AND codpar = :codpar
        AND gestion = :gestion
      """, nativeQuery = true)
  void changeState(
      @Param("codmat") String codmat,
      @Param("codpar") Integer codpar,
      @Param("gestion") Integer gestion,
      @Param("estado") Integer estado);

  /**
   * Verificar si ya existe una asignación específica.
   */
  @Query(value = """
      SELECT COUNT(*) > 0
      FROM mapa
      WHERE codmat = :codmat
        AND codpar = :codpar
        AND gestion = :gestion
      """, nativeQuery = true)
  boolean existeAsignacion(
      @Param("codmat") String codmat,
      @Param("codpar") Integer codpar,
      @Param("gestion") Integer gestion);

  /**
   * B-16. Obtener todas las clases disponibles para el dropdown del formulario.
   * Retorna una descripción concatenada: "Nivel - Materia - Paralelo".
   * Solo incluye clases activas (estado=1).
   * 
   * @return Lista de [codmat, codpar, gestion, descripcion]
   */
  @Query(value = """
      SELECT
          m.codmat,
          m.codpar,
          m.gestion,
          CONCAT(n.nombre, ' - ', mat.nombre, ' - ', p.nombre) AS descripcion
      FROM mapa m
      INNER JOIN materias mat ON m.codmat = mat.codmat
      INNER JOIN niveles n ON mat.codn = n.codn
      INNER JOIN paralelos p ON m.codpar = p.codpar
      WHERE m.estado = 1
      ORDER BY n.nombre, mat.nombre, p.nombre
      """, nativeQuery = true)
  List<Object[]> findClasesParaCombonative();
}