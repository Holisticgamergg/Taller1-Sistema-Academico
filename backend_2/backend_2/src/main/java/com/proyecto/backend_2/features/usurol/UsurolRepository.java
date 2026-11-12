package com.proyecto.backend_2.features.usurol;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.backend_2.features.roles.RolModel;
import com.proyecto.backend_2.ids.UsurolId;

@Repository
public interface UsurolRepository extends JpaRepository<UsurolModel, UsurolId> {

    /**
     * Query legacy (mantener por compatibilidad).
     */
    @Query("SELECT ur.rolUsuario FROM UsurolModel ur WHERE LOWER(TRIM(ur.usuarioRol.login)) = LOWER(TRIM(:login))")
    List<RolModel> findRolesByLogin(@Param("login") String login);

    /**
     * B-9. ASIGNAR ROLES A UN USUARIO - Obtener roles para asignar a un usuario.
     * 
     * Esta query lista TODOS los roles con un flag "asignado" que indica
     * si están o no asignados al usuario seleccionado (login).
     * 
     * Filtros:
     * - filtroNombre: Busca roles por nombre (case-insensitive, parcial)
     * - tipoAsignacion:
     * * 'TODOS' = Muestra todos los roles (asignados y no asignados)
     * * 'SI' = Solo roles YA asignados al usuario (ur.login IS NOT NULL)
     * * 'NO' = Solo roles NO asignados al usuario (ur.login IS NULL)
     * 
     * @param login          Login del usuario seleccionado
     * @param filtroNombre   Filtro opcional por nombre del rol
     * @param tipoAsignacion Tipo de filtro: 'TODOS', 'SI', 'NO'
     * @return Lista de [codr, nombre, asignado]
     */
    @Query(value = """
            SELECT
                r.codr,
                r.nombre,
                (CASE WHEN ur.login IS NOT NULL THEN TRUE ELSE FALSE END) AS asignado
            FROM ROLES r
            LEFT JOIN USUROL ur ON r.codr = ur.codr AND ur.login = :login
            WHERE
                (CAST(:filtroNombre AS text) IS NULL OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', :filtroNombre, '%')))
            AND (
                (:tipoAsignacion = 'TODOS') OR
                (:tipoAsignacion = 'SI' AND ur.login IS NOT NULL) OR
                (:tipoAsignacion = 'NO' AND ur.login IS NULL)
            )
            ORDER BY r.nombre
            """, nativeQuery = true)
    List<Object[]> getRolesParaAsignar(
            @Param("login") String login,
            @Param("filtroNombre") String filtroNombre,
            @Param("tipoAsignacion") String tipoAsignacion);
}
