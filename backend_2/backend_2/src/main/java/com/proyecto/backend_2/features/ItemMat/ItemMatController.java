package com.proyecto.backend_2.features.ItemMat;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.backend_2.dtos.ItematCreateDto;
import com.proyecto.backend_2.dtos.ItematResponseDto;
import com.proyecto.backend_2.ids.ItematId;

import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Controller REST para gestión de Items-Materia
 * Endpoints para CRUD B-12 [5]
 */
@RestController
@RequestMapping("/api/itemat")
@RequiredArgsConstructor
public class ItemMatController {

    private final ItemMatService service;

    /**
     * GET /api/itemat
     * Listar todas las asignaciones
     */
    @GetMapping
    public ResponseEntity<List<ItematModel>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    /**
     * GET /api/itemat/materia/{codmat}
     * Obtener items asignados a una materia.
     * La gestión se obtiene automáticamente desde GENERAL.
     * Incluye el nombre del item mediante JOIN.
     * 
     * @param codmat Código de la materia
     */
    @GetMapping("/materia/{codmat}")
    public ResponseEntity<List<ItematResponseDto>> getItemsAsignados(
            @PathVariable String codmat) {
        return ResponseEntity.ok(service.getItemsAsignados(codmat));
    }

    /**
     * GET /api/itemat/{codmat}/{codi}/{gestion}
     * Buscar una asignación específica por su clave compuesta
     */
    @GetMapping("/{codmat}/{codi}/{gestion}")
    public ResponseEntity<ItematModel> buscarPorId(
            @PathVariable String codmat,
            @PathVariable Integer codi,
            @PathVariable Integer gestion) {
        ItematId id = new ItematId(codmat, codi, gestion);
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    /**
     * POST /api/itemat
     * Asignar un item a una materia (crear nueva asignación)
     * Asigna estado = 1 automáticamente
     * 
     * Request body: ItematCreateDto
     */
    @PostMapping
    public ResponseEntity<ItematModel> asignarItem(@RequestBody ItematCreateDto dto) {
        ItematModel nuevaAsignacion = service.asignarItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsignacion);
    }

    /**
     * PUT /api/itemat/{codmat}/{codi}/{gestion}/ponderacion
     * Actualizar solo la ponderación de una asignación existente
     * 
     * Request body: ItematCreateDto (solo se usa el campo ponderacion)
     */
    @PutMapping("/{codmat}/{codi}/{gestion}/ponderacion")
    public ResponseEntity<ItematModel> actualizarPonderacion(
            @PathVariable String codmat,
            @PathVariable Integer codi,
            @PathVariable Integer gestion,
            @RequestBody ItematCreateDto dto) {
        ItematId id = new ItematId(codmat, codi, gestion);
        return ResponseEntity.ok(service.actualizarPonderacion(id, dto));
    }

    /**
     * PATCH /api/itemat/{codmat}/{codi}/{gestion}/estado
     * Cambiar el estado de una asignación
     * 
     * @param estado Nuevo estado (0=Baja, 1=Activo)
     */
    @PatchMapping("/{codmat}/{codi}/{gestion}/estado")
    public ResponseEntity<Void> changeState(
            @PathVariable String codmat,
            @PathVariable Integer codi,
            @PathVariable Integer gestion,
            @RequestParam Integer estado) {
        ItematId id = new ItematId(codmat, codi, gestion);
        service.changeState(id, estado);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/itemat/{codmat}/{codi}/{gestion}
     * Eliminación lógica de una asignación (cambia estado a 0)
     */
    @DeleteMapping // <--- QUITAMOS la ruta extra "/{codmat}..."
    public ResponseEntity<Void> eliminar(
            @RequestParam String codmat, // <--- CAMBIAMOS @PathVariable por @RequestParam
            @RequestParam Integer codi) { // <--- CAMBIAMOS @PathVariable por @RequestParam

        // Obtenemos la gestión actual (puedes inyectar GeneralService si lo necesitas)
        // O si el front no manda gestión, asumimos 2025 (o lo que corresponda)
        Integer gestionActual = 2025; // Obtener esto dinámicamente si es posible

        ItematId id = new ItematId(codmat, codi, gestionActual);
        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/itemat/{codmat}/{codi}/{gestion}/habilitar
     * Habilitar una asignación (cambia estado a 1)
     */
    @PatchMapping("/{codmat}/{codi}/{gestion}/habilitar")
    public ResponseEntity<Void> habilitar(
            @PathVariable String codmat,
            @PathVariable Integer codi,
            @PathVariable Integer gestion) {
        ItematId id = new ItematId(codmat, codi, gestion);
        service.habilitar(id);
        return ResponseEntity.ok().build();
    }
}
