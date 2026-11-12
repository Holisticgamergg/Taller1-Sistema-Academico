package com.proyecto.backend_2.features.Dicta;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_2.features.Dicta.dtos.ClaseDisponibleDto;
import com.proyecto.backend_2.features.Dicta.dtos.DictaCreateDto;
import com.proyecto.backend_2.features.Dicta.dtos.DictaResponseDto;
import com.proyecto.backend_2.ids.DictaId;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller para DICTA (Asignación Docente).
 * B-16. Gestión de asignaciones de profesores a clases.
 */
@RestController
@RequestMapping("/api/dicta")
@RequiredArgsConstructor
public class DictaController {

    private final DictaService service;

    /**
     * GET /api/dicta
     * Obtener todas las asignaciones docentes con filtros opcionales.
     * 
     * @param codn   Código del nivel (opcional)
     * @param filtro Texto para buscar en materia o profesor (opcional)
     * @param estado 0=Inactivos, 1=Activos, 2=Todos (default: 1 - Activos)
     */
    @GetMapping
    public ResponseEntity<List<DictaResponseDto>> getAll(
            @RequestParam(required = false) Integer codn,
            @RequestParam(required = false) String filtro,
            @RequestParam(defaultValue = "1") Integer estado) {
        return ResponseEntity.ok(service.getAll(codn, filtro, estado));
    }

    /**
     * POST /api/dicta
     * Crear una nueva asignación docente.
     * Valida que el profesor y la clase existan.
     * 
     * @param dto Datos de la asignación (codmat, codpar, gestion, login)
     */
    @PostMapping
    public ResponseEntity<DictaModel> create(@RequestBody DictaCreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{codmat}/{codpar}/{gestion}/{login}")
    public ResponseEntity<Void> update(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion,
            @PathVariable String login,
            @RequestBody DictaCreateDto dto) {

        // Llamamos al servicio (Tendrás que crear este método en DictaService si no
        // existe)
        // Nota: El servicio debería borrar el viejo y crear el nuevo, o actualizar el
        // estado.
        service.update(codmat, codpar, gestion, login, dto);

        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/dicta?codmat=X&codpar=Y&gestion=Z&login=W
     * Eliminar (baja física) una asignación docente usando query params.
     */
    @DeleteMapping(params = { "codmat", "codpar", "gestion", "login" })
    public ResponseEntity<Void> delete(
            @RequestParam String codmat,
            @RequestParam Integer codpar,
            @RequestParam Integer gestion,
            @RequestParam String login) {
        DictaId id = new DictaId(codmat, codpar, gestion, login);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/dicta/{codmat}/{codpar}/{gestion}/{login}/habilitar
     * Habilitar una asignación docente previamente deshabilitada (con path
     * variables).
     */
    @PostMapping("/{codmat}/{codpar}/{gestion}/{login}/habilitar")
    public ResponseEntity<Void> enableByPath(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion,
            @PathVariable String login) {

        DictaId id = new DictaId(codmat, codpar, gestion, login);
        service.changeState(id, 1); // 1 = Activo

        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/dicta/habilitar
     * Habilitar una asignación docente previamente deshabilitada (con body).
     */
    @PostMapping("/habilitar")
    public ResponseEntity<Void> habilitar(@RequestBody DictaCreateDto dto) {
        DictaId id = new DictaId(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getLogin());
        service.habilitar(id);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /api/dicta/clases-disponibles
     * Obtener todas las clases disponibles para el dropdown del formulario.
     * Retorna: Nivel - Materia - Paralelo.
     */
    @GetMapping("/clases-disponibles")
    public ResponseEntity<List<ClaseDisponibleDto>> getClasesDisponibles() {
        return ResponseEntity.ok(service.getClasesDisponibles());
    }
}