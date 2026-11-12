package com.proyecto.backend_2.features.Materias;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.backend_2.features.Materias.dtos.MateriaRequestDto;
import com.proyecto.backend_2.features.Materias.dtos.MateriaResponseDto;

import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Controller REST para gestión de MATERIAS
 * Endpoints para CRUD B-12
 */
@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
public class MateriasController {

    private final MateriasService service;

    @GetMapping
    public List<MateriaResponseDto> getAll(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer estado) {
        return service.getAll(nombre, estado);
    }

    @GetMapping("/{codmat}")
    public MateriaResponseDto getById(@PathVariable String codmat) {
        return service.getById(codmat);
    }

    @PostMapping
    public MateriaResponseDto create(@RequestBody MateriaRequestDto materia) {
        return service.create(materia);
    }

    @PutMapping("/{codmat}")
    public MateriaResponseDto update(@PathVariable String codmat, @RequestBody MateriaRequestDto materia) {
        return service.update(codmat, materia);
    }

    @DeleteMapping("/{codmat}")
    public ResponseEntity<Void> delete(@PathVariable String codmat) {
        service.changeState(codmat, 0);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{codmat}/habilitar")
    public ResponseEntity<Void> enable(@PathVariable String codmat) {
        service.changeState(codmat, 1);
        return ResponseEntity.ok().build();
    }

    /**
     * B-12. ACTUALIZAR CÓDIGO DE MATERIA (modificar PK).
     * PATCH /api/materias/{oldCodmat}/codigo?newCodmat=NEW-CODE
     * 
     * Ejemplo: PATCH /api/materias/MAT-101/codigo?newCodmat=CS-101
     * 
     * Este endpoint actualiza el código de la materia (que es la PK) y
     * todas sus referencias en las tablas relacionadas (MAPA, ITEMAT, DICTA,
     * PROGRA).
     * 
     * @param oldCodmat Código actual de la materia
     * @param newCodmat Nuevo código (enviado como query parameter)
     * @return 200 OK si la actualización fue exitosa
     */
    @PatchMapping("/{oldCodmat}/codigo")
    public ResponseEntity<Void> updateCodigo(
            @PathVariable String oldCodmat,
            @RequestParam String newCodmat) {
        service.updateCodigo(oldCodmat, newCodmat);
        return ResponseEntity.ok().build();
    }
}