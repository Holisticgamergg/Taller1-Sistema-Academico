package com.proyecto.backend_2.features.niveles;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/niveles")
@RequiredArgsConstructor
public class NivelesController {

    private final NivelesService service;

    /**
     * B-13. GESTIÓN NIVELES - Listado con filtros.
     * GET /api/niveles?nombre=Primaria&estado=1
     */
    @GetMapping
    public List<NivelesModel> getAll(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer estado) {
        return service.getAll(nombre, estado);
    }

    /**
     * Listar solo niveles activos (para dropdown).
     * GET /api/niveles/activos
     */
    @GetMapping("/activos")
    public List<NivelesModel> getActivos() {
        return service.listarActivos();
    }

    /**
     * Obtener un nivel por ID (para modal de edición).
     * GET /api/niveles/{id}
     */
    @GetMapping("/{id}")
    public NivelesModel getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    /**
     * B-13.1. ADICIONAR NUEVO NIVEL.
     * POST /api/niveles
     */
    @PostMapping
    public NivelesModel create(@RequestBody NivelesModel nivel) {
        return service.post(nivel);
    }

    /**
     * B-13.2. MODIFICAR NIVEL.
     * PUT /api/niveles/{id}
     */
    @PutMapping("/{id}")
    public NivelesModel update(@PathVariable Integer id, @RequestBody NivelesModel nivel) {
        return service.put(id, nivel);
    }

    /**
     * B-13.3. ELIMINAR NIVEL (lógico).
     * DELETE /api/niveles/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.changeState(id, 0);
        return ResponseEntity.ok().build();
    }

    /**
     * B-13.4. HABILITAR NIVEL.
     * POST /api/niveles/{id}/habilitar
     */
    @PostMapping("/{id}/habilitar")
    public ResponseEntity<Void> enable(@PathVariable Integer id) {
        service.changeState(id, 1);
        return ResponseEntity.ok().build();
    }
}