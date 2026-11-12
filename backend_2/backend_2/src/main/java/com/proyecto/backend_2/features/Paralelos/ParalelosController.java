package com.proyecto.backend_2.features.Paralelos;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyecto.backend_2.dtos.ParaleloDto;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/paralelos")
@RequiredArgsConstructor
public class ParalelosController {

    private final ParalelosService service;

    /**
     * GET /api/paralelos?nombre=X&estado=2
     * Obtener paralelos con filtros opcionales.
     * 
     * @param nombre Nombre a buscar (opcional, búsqueda parcial)
     * @param estado 0=Inactivos, 1=Activos, 2=Todos (por defecto 2)
     */
    @GetMapping
    public ResponseEntity<List<ParalelosModel>> getAll(
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "2") Integer estado) {
        return ResponseEntity.ok(service.getFiltrado(nombre, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParalelosModel> buscarPorId(@PathVariable Integer id) {

        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ParalelosModel> crear(@RequestBody ParaleloDto dto) {
        ParalelosModel nuevoParalelo = service.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoParalelo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParalelosModel> actualizar(
            @PathVariable Integer id,
            @RequestBody ParaleloDto dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/habilitar")
    public ResponseEntity<Void> habilitar(@PathVariable Integer id) {
        service.habilitar(id);
        return ResponseEntity.ok().build();
    }
}