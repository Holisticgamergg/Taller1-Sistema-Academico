package com.proyecto.backend_2.features.rolme;

import com.proyecto.backend_2.dtos.MenuAsignadoDto;
import com.proyecto.backend_2.ids.RolmeId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

/**
 * Controller para B-8: ASIGNAR MENÚS A UN ROL.
 * Gestiona la relación Muchos-a-Muchos entre ROLES y MENUS.
 */
@RestController
@RequestMapping("/api/rolme")
@RequiredArgsConstructor
public class RolmeController {

    private final RolmeService rolmeService;

    /*
     * @param codr
     * 
     * @param filtroNombre
     * 
     * @param tipoAsignacion
     * 
     * @return
     */
    @GetMapping("/asignacion")
    public List<MenuAsignadoDto> getMenusParaAsignar(
            @RequestParam Integer codr,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) String tipoAsignacion) {
        return rolmeService.getMenusParaAsignar(codr,
                filtroNombre, tipoAsignacion);
    }

    @PostMapping
    public ResponseEntity<Void> asignarMenu(@RequestBody RolmeId id) {
        rolmeService.asignarMenu(id);
        return ResponseEntity.ok().build();
    }

    /**
     * @param codr Código del rol
     * @param codm Código del menú
     * @return 200 OK
     */
    @DeleteMapping
    public ResponseEntity<Void> desasignarMenu(
            @RequestParam Integer codr,
            @RequestParam Integer codm) {

        RolmeId id = new RolmeId(codr, codm);
        rolmeService.desasignarMenu(id);
        return ResponseEntity.ok().build();
    }
}
