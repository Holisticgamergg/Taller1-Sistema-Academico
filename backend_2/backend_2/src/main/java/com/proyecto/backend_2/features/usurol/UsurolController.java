package com.proyecto.backend_2.features.usurol;

import com.proyecto.backend_2.dtos.RolAsignadoDto;
import com.proyecto.backend_2.ids.UsurolId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

/**
 * Controller para B-9: ASIGNAR ROLES A UN USUARIO.
 * Gestiona la relación Muchos-a-Muchos entre USUARIOS y ROLES.
 */
@RestController
@RequestMapping("/api/usurol")
@RequiredArgsConstructor
public class UsurolController {

    private final UsurolService usurolService;

    /**
     * B-9. Obtener la lista filtrada de roles para asignar a un usuario.
     * 
     * Ejemplo: GET
     * /api/usurol/asignacion?login=admin&filtroNombre=Docente&tipoAsignacion=SI
     * 
     * @param login          Login del usuario seleccionado (obligatorio)
     * @param filtroNombre   Filtro opcional por nombre del rol
     * @param tipoAsignacion 'TODOS' (default), 'SI', 'NO'
     * @return Lista de roles con flag asignado
     */
    @GetMapping("/asignacion")
    public List<RolAsignadoDto> getRolesParaAsignar(
            @RequestParam String login,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(defaultValue = "TODOS") String tipoAsignacion) {
        return usurolService.getRolesParaAsignar(login, filtroNombre, tipoAsignacion);
    }

    /**
     * B-9. Asignar un rol a un usuario (marcar checkbox).
     * 
     * Ejemplo: POST /api/usurol
     * Body: { "login": "admin", "codr": 1 }
     * 
     * @param id Clave compuesta (login, codr)
     * @return 200 OK
     */
    @PostMapping
    public ResponseEntity<Void> asignarRol(@RequestBody UsurolId id) {
        usurolService.asignarRol(id);
        return ResponseEntity.ok().build();
    }

    /**
     * B-9. Desasignar un rol de un usuario (desmarcar checkbox).
     * 
     * Ejemplo: DELETE /api/usurol?login=admin&codr=1
     * 
     * @param login Login del usuario
     * @param codr  Código del rol
     * @return 200 OK
     */
    @DeleteMapping
    public ResponseEntity<Void> desasignarRol(
            @RequestParam String login,
            @RequestParam Integer codr) {

        UsurolId id = new UsurolId(login, codr);
        usurolService.desasignarRol(id);
        return ResponseEntity.ok().build();
    }
}
