package com.proyecto.backend_2.features.Mapa;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.backend_2.dtos.MapaCreateDto;
import com.proyecto.backend_2.dtos.MapaResponseDto;
import com.proyecto.backend_2.ids.MapaId;

import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Controller REST para gestión de Materia-Paralelo (MAPA).
 * Endpoints para CRUD B-12.1
 */
@RestController
@RequestMapping("/api/mapa")
@RequiredArgsConstructor
public class MapaController {

    private final MapaService service;

    /**
     * GET /api/mapa
     * Listar todas las asignaciones.
     */
    @GetMapping
    public ResponseEntity<List<MapaModel>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    /**
     * GET /api/mapa/materia/{codmat}
     * Obtener paralelos asignados a una materia.
     * La gestión se obtiene automáticamente desde GENERAL.
     * Incluye el nombre del paralelo mediante JOIN.
     * 
     * @param codmat Código de la materia
     */
    @GetMapping("/materia/{codmat}")
    public ResponseEntity<List<MapaResponseDto>> getParalelosAsignados(
            @PathVariable String codmat) {
        return ResponseEntity.ok(service.getParalelosAsignados(codmat));
    }

    /**
     * GET /api/mapa/{codmat}/{codpar}/{gestion}
     * Buscar una asignación específica por su clave compuesta.
     */
    @GetMapping("/{codmat}/{codpar}/{gestion}")
    public ResponseEntity<MapaModel> buscarPorId(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion) {
        MapaId id = new MapaId(codmat, codpar, gestion);
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    /**
     * POST /api/mapa
     * Asignar un paralelo a una materia (crear nueva asignación).
     * Asigna estado = 1 automáticamente.
     * 
     * Request body: MapaCreateDto
     */
    @PostMapping
    public ResponseEntity<MapaModel> asignarParalelo(@RequestBody MapaCreateDto dto) {
        MapaModel nuevaAsignacion = service.asignarParalelo(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsignacion);
    }

    /**
     * PATCH /api/mapa/{codmat}/{codpar}/{gestion}/estado
     * Cambiar el estado de una asignación.
     * 
     * @param estado Nuevo estado (0=Baja, 1=Activo)
     */
    @PatchMapping("/{codmat}/{codpar}/{gestion}/estado")
    public ResponseEntity<Void> changeState(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion,
            @RequestParam Integer estado) {
        MapaId id = new MapaId(codmat, codpar, gestion);
        service.changeState(id, estado);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/mapa/{codmat}/{codpar}/{gestion}
     * Eliminación lógica de una asignación (cambia estado a 0).
     * Usando path variables.
     */
    @DeleteMapping("/{codmat}/{codpar}/{gestion}")
    public ResponseEntity<Void> eliminarPorPath(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion) {
        MapaId id = new MapaId(codmat, codpar, gestion);
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/mapa?codmat=X&codpar=Y&gestion=Z
     * Eliminación lógica de una asignación (cambia estado a 0).
     * Usando query parameters (para compatibilidad con frontend).
     */
    @DeleteMapping(params = { "codmat", "codpar", "gestion" })
    public ResponseEntity<Void> eliminarPorParams(
            @RequestParam String codmat,
            @RequestParam Integer codpar,
            @RequestParam Integer gestion) {
        MapaId id = new MapaId(codmat, codpar, gestion);
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/mapa/{codmat}/{codpar}/{gestion}/habilitar
     * Habilitar una asignación (cambia estado a 1).
     */
    @PatchMapping("/{codmat}/{codpar}/{gestion}/habilitar")
    public ResponseEntity<Void> habilitar(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion) {
        MapaId id = new MapaId(codmat, codpar, gestion);
        service.habilitar(id);
        return ResponseEntity.ok().build();
    }
}