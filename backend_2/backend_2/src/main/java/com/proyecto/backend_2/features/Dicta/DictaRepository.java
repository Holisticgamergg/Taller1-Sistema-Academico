package com.proyecto.backend_2.features.Dicta;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.ids.DictaId;

/**
 * Repository para DICTA con queries nativas.
 * Gestiona asignaciones de profesores a clases.
 */
@Repository
public interface DictaRepository extends JpaRepository<DictaModel, DictaId> {

    /**
     * B-16. Obtener todas las asignaciones docentes con filtros.
     * Hace JOIN entre DICTA, MAPA, MATERIAS, NIVELES, PARALELOS, USUARIOS y
     * PERSONAL.
     * 
     * @param codn   Código del nivel (null = todos)
     * @param filtro Texto para buscar en nombre de materia o nombre/apellido de
     *               profesor (null = todos)
     * @param estado 0=Inactivos, 1=Activos, 2=Todos
     * @return Lista de [codmat, codpar, gestion, login, nombreNivel, nombreMateria,
     *         nombreParalelo, nombreProfesor, estado]
     */
    @Query(value = """
            SELECT
                d.codmat,
                d.codpar,
                d.gestion,
                d.login,
                n.nombre AS nombreNivel,
                m.nombre AS nombreMateria,
                p.nombre AS nombreParalelo,
                CONCAT(per.nombre, ' ', per.ap) AS nombreProfesor,
                d.estado
            FROM dicta d
            INNER JOIN mapa ma ON d.codmat = ma.codmat AND d.codpar = ma.codpar AND d.gestion = ma.gestion
            INNER JOIN materias m ON ma.codmat = m.codmat
            INNER JOIN niveles n ON m.codn = n.codn
            INNER JOIN paralelos p ON ma.codpar = p.codpar
            INNER JOIN usuarios u ON d.login = u.login
            INNER JOIN personal per ON u.codp = per.codp
            WHERE (CAST(:codn AS INTEGER) IS NULL OR n.codn = :codn)
              AND (CAST(:filtro AS text) IS NULL OR
                   LOWER(m.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR
                   LOWER(per.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR
                   LOWER(per.ap) LIKE LOWER(CONCAT('%', :filtro, '%')))
              AND (:estado = 2 OR d.estado = :estado)
            ORDER BY n.nombre, m.nombre, p.nombre, per.nombre
            """, nativeQuery = true)
    List<Object[]> findAllByFilters(
            @Param("codn") Integer codn,
            @Param("filtro") String filtro,
            @Param("estado") Integer estado);

    /**
     * Cambiar el estado de una asignación docente.
     * Usado para eliminación lógica (estado=0) o habilitación (estado=1).
     */
    @Modifying
    @Transactional
    @Query(value = """
            UPDATE dicta
            SET estado = :estado
            WHERE codmat = :codmat
              AND codpar = :codpar
              AND gestion = :gestion
              AND login = :login
            """, nativeQuery = true)
    void changeState(
            @Param("codmat") String codmat,
            @Param("codpar") Integer codpar,
            @Param("gestion") Integer gestion,
            @Param("login") String login,
            @Param("estado") Integer estado);

    /**
     * Verificar si ya existe una asignación específica.
     */
    @Query(value = """
            SELECT COUNT(*) > 0
            FROM dicta
            WHERE codmat = :codmat
              AND codpar = :codpar
              AND gestion = :gestion
              AND login = :login
            """, nativeQuery = true)
    boolean existeAsignacion(
            @Param("codmat") String codmat,
            @Param("codpar") Integer codpar,
            @Param("gestion") Integer gestion,
            @Param("login") String login);
}