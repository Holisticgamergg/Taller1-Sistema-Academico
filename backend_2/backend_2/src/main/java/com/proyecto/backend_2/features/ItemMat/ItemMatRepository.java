package com.proyecto.backend_2.features.ItemMat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.ids.ItematId;

import java.util.List;

/**
 * Repository para ITEMAT (Items-Materia)
 * Todas las queries personalizadas usan nativeQuery = true
 */
@Repository
public interface ItemMatRepository extends JpaRepository<ItematModel, ItematId> {

  /**
   * Obtener todos los items asignados a una materia en una gestión específica
   * Hace JOIN con ITEMS para obtener el nombreItem
   * 
   * @param codmat  Código de la materia
   * @param gestion Año de gestión
   * @return Lista de Object[] con: codmat, codi, gestion, nombreItem,
   *         ponderacion, estado
   */
  @Query(value = """
      SELECT
          im.codmat,
          im.codi,
          im.gestion,
          i.nombre,
          im.ponderacion,
          im.estado
      FROM itemat im
      INNER JOIN items i ON im.codi = i.codi
      WHERE im.codmat = :codmat
        AND im.gestion = :gestion
      ORDER BY im.codi
      """, nativeQuery = true)
  List<Object[]> findItemsAsignadosNative(
      @Param("codmat") String codmat,
      @Param("gestion") Integer gestion);

  /**
   * Cambiar el estado de una asignación Item-Materia
   * Usado para eliminación lógica (estado=0) o habilitación (estado=1)
   * 
   * @param codmat  Código de la materia
   * @param codi    Código del item
   * @param gestion Año de gestión
   * @param estado  Nuevo estado (0=Baja, 1=Activo)
   */
  @Modifying
  @Transactional
  @Query(value = """
      UPDATE itemat
      SET estado = :estado
      WHERE codmat = :codmat
        AND codi = :codi
        AND gestion = :gestion
      """, nativeQuery = true)
  void changeState(
      @Param("codmat") String codmat,
      @Param("codi") Integer codi,
      @Param("gestion") Integer gestion,
      @Param("estado") Integer estado);

  /**
   * Verificar si ya existe una asignación específica
   */
  @Query(value = """
      SELECT COUNT(*) > 0
      FROM itemat
      WHERE codmat = :codmat
        AND codi = :codi
        AND gestion = :gestion
      """, nativeQuery = true)
  boolean existeAsignacion(
      @Param("codmat") String codmat,
      @Param("codi") Integer codi,
      @Param("gestion") Integer gestion);

  // CORRECCIÓN: Usamos i.id.codmat en lugar de i.codmat
  @Query("SELECT COALESCE(SUM(i.ponderacion), 0) FROM ItematModel i WHERE i.id.codmat = :codmat AND i.id.gestion = :gestion AND i.estado = 1")
  Integer sumarPonderacionPorMateria(@Param("codmat") String codmat, @Param("gestion") Integer gestion);

}
