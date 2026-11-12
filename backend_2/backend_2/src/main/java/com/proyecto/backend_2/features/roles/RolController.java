package com.proyecto.backend_2.features.roles;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService service;

    // GET con paginación y filtros
    // Ej: /api/roles/filtrado?page=0&size=15&nombre=Admin&estado=1
    @GetMapping("/filtrado")
    public Page<RolModel> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer estado) {
        return service.getRoles(nombre, estado, page, size);
    }

    @GetMapping("/{id}")
    public RolModel getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public RolModel create(@RequestBody RolModel rol) {
        return service.create(rol);
    }

    @PutMapping("/{id}")
    public RolModel update(@PathVariable Integer id, @RequestBody RolModel rol) {
        return service.update(id, rol);
    }

    // B5.3 Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.changeState(id, 0);
        return ResponseEntity.ok().build();
    }

    // B5.4 Habilitar
    @PostMapping("/{id}/habilitar")
    public ResponseEntity<Void> enable(@PathVariable Integer id) {
        service.changeState(id, 1);
        return ResponseEntity.ok().build();
    }
}