package com.proyecto.backend_2.features.Items;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsController {

    private final ItemsService service;

    /**
     * B-11. GESTIÓN ITEMS - Listado con filtros.
     * GET /api/items?nombre=Examen&estado=1
     */
    @GetMapping
    public List<ItemsModel> getAll(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer estado) {
        return service.getAll(nombre, estado);
    }

    /**
     * Listar solo items activos (para dropdown).
     * GET /api/items/activos
     */
    @GetMapping("/activos")
    public List<ItemsModel> getActivos() {
        return service.listarActivos();
    }

    /**
     * Obtener un item por ID (para modal de edición).
     * GET /api/items/{id}
     */
    @GetMapping("/{id}")
    public ItemsModel getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    /**
     * B-11. ADICIONAR NUEVO ITEM.
     * POST /api/items
     */
    @PostMapping
    public ItemsModel create(@RequestBody ItemsModel item) {
        return service.create(item);
    }

    /**
     * B-11. MODIFICAR ITEM.
     * PUT /api/items/{id}
     */
    @PutMapping("/{id}")
    public ItemsModel update(@PathVariable Integer id, @RequestBody ItemsModel item) {
        return service.update(id, item);
    }

    /**
     * B-11. ELIMINAR ITEM (lógico).
     * DELETE /api/items/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.changeState(id, 0);
        return ResponseEntity.ok().build();
    }

    /**
     * B-11. HABILITAR ITEM.
     * POST /api/items/{id}/habilitar
     */
    @PostMapping("/{id}/habilitar")
    public ResponseEntity<Void> enable(@PathVariable Integer id) {
        service.changeState(id, 1);
        System.out.println(">>> DEBUG UPDATE ITEM <<<");
        System.out.println("ID recibido: " + id);

        return ResponseEntity.ok().build();
    }
}
