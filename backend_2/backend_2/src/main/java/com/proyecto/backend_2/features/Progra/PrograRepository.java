package com.proyecto.backend_2.features.Progra;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.ids.PrograId;

/**
 * Repository para PROGRA con queries nativas.
 * Gestiona inscripciones de alumnos a clases.
 */
@Repository
public interface PrograRepository extends JpaRepository<PrograModel, PrograId> {

        /**
         * B-17. Obtener todas las inscripciones con filtros.
         * Hace JOIN entre PROGRA, MAPA, MATERIAS, NIVELES, PARALELOS y PERSONAL.
         * 
         * @param codn   Código del nivel (null = todos)
         * @param filtro Texto para buscar en nombre de materia o nombre del alumno
         *               (null = todos)
         * @param estado 0=Inactivos, 1=Activos, 2=Todos
         * @return Lista de [codmat, codpar, gestion, codp, nombreNivel, nombreMateria,
         *         nombreParalelo, nombreAlumno, estado]
         */
        @Query(value = """
                        SELECT
                            pr.codmat,
                            pr.codpar,
                            pr.gestion,
                            pr.codp,
                            n.nombre AS nombreNivel,
                            m.nombre AS nombreMateria,
                            p.nombre AS nombreParalelo,
                            CONCAT(per.nombre, ' ', per.ap, ' ', COALESCE(per.am, '')) AS nombreAlumno,
                            pr.estado
                        FROM progra pr
                        INNER JOIN mapa ma ON pr.codmat = ma.codmat AND pr.codpar = ma.codpar AND pr.gestion = ma.gestion
                        INNER JOIN materias m ON ma.codmat = m.codmat
                        INNER JOIN niveles n ON m.codn = n.codn
                        INNER JOIN paralelos p ON ma.codpar = p.codpar
                        INNER JOIN personal per ON pr.codp = per.codp
                        WHERE (CAST(:codn AS INTEGER) IS NULL OR n.codn = :codn)
                          AND (CAST(:filtro AS text) IS NULL OR
                               LOWER(m.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR
                               LOWER(per.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR
                               LOWER(per.ap) LIKE LOWER(CONCAT('%', :filtro, '%')))
                          AND (:estado = 2 OR pr.estado = :estado)
                        ORDER BY n.nombre, m.nombre, p.nombre, per.nombre
                        """, nativeQuery = true)
        List<Object[]> findAllByFilters(
                        @Param("codn") Integer codn,
                        @Param("filtro") String filtro,
                        @Param("estado") Integer estado);

        /**
         * Cambiar el estado de una inscripción.
         * Usado para eliminación lógica (estado=0) o habilitación (estado=1).
         */
        @Modifying
        @Transactional
        @Query(value = """
                        UPDATE progra
                        SET estado = :estado
                        WHERE codmat = :codmat
                          AND codpar = :codpar
                          AND gestion = :gestion
                          AND codp = :codp
                        """, nativeQuery = true)
        void changeState(
                        @Param("codmat") String codmat,
                        @Param("codpar") Integer codpar,
                        @Param("gestion") Integer gestion,
                        @Param("codp") Integer codp,
                        @Param("estado") Integer estado);

        /**
         * Verificar si ya existe una inscripción específica.
         */
        @Query(value = """
                        SELECT COUNT(*) > 0
                        FROM progra
                        WHERE codmat = :codmat
                          AND codpar = :codpar
                          AND gestion = :gestion
                          AND codp = :codp
                        """, nativeQuery = true)
        boolean existeInscripcion(
                        @Param("codmat") String codmat,
                        @Param("codpar") Integer codpar,
                        @Param("gestion") Integer gestion,
                        @Param("codp") Integer codp);

        /**
         * Obtener materias inscritas de un alumno.
         * Formato: [codmat, sigla, nombreMateria, nivel, codpar]
         */
        @Query(value = """
                        SELECT
                            m.codmat,
                            m.codmat as sigla,
                            m.nombre as materia,
                            n.nombre as nivel,
                            ma.codpar as paralelo
                        FROM progra pr
                        INNER JOIN mapa ma ON pr.codmat = ma.codmat
                            AND pr.codpar = ma.codpar
                            AND pr.gestion = ma.gestion
                        INNER JOIN materias m ON ma.codmat = m.codmat
                        INNER JOIN niveles n ON m.codn = n.codn
                        WHERE pr.codp = :codp
                          AND pr.estado = 1
                          AND ma.estado = 1
                          AND m.estado = 1
                        ORDER BY n.nombre, m.nombre
                        """, nativeQuery = true)
        List<Object[]> findMateriasAlumno(@Param("codp") Integer codp);
}