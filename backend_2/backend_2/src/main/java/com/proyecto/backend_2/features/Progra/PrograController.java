package com.proyecto.backend_2.features.Progra;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_2.features.Progra.dtos.AlumnoDto;
import com.proyecto.backend_2.features.Progra.dtos.MateriaMovilDto;
import com.proyecto.backend_2.features.Progra.dtos.PrograCreateDto;
import com.proyecto.backend_2.features.Progra.dtos.PrograResponseDto;
import com.proyecto.backend_2.ids.PrograId;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller para PROGRA (Inscripción de Alumnos).
 * B-17. Gestión de inscripciones de alumnos a clases.
 */
@RestController
@RequestMapping("/api/progra")
@RequiredArgsConstructor
public class PrograController {

    private final PrograService service;

    /**
     * GET /api/progra
     * Obtener todas las inscripciones con filtros opcionales.
     * 
     * @param codn   Código del nivel (opcional)
     * @param search Texto para buscar en materia o alumno (opcional)
     * @param estado 0=Inactivos, 1=Activos, 2=Todos (default: 2 - Todos)
     */
    @GetMapping
    public ResponseEntity<List<PrograResponseDto>> getAll(
            @RequestParam(required = false) Integer codn,
            @RequestParam(value = "search", required = false) String filtro,
            @RequestParam(defaultValue = "2") Integer estado) {
        return ResponseEntity.ok(service.getAll(codn, filtro, estado));
    }

    /**
     * POST /api/progra
     * Crear una nueva inscripción.
     * Valida que el alumno (tipo='E') y la clase existan.
     * 
     * @param dto Datos de la inscripción (codmat, codpar, gestion, codp)
     */
    @PostMapping
    public ResponseEntity<PrograModel> create(@RequestBody PrograCreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    /**
     * DELETE /api/progra?codmat=X&codpar=Y&gestion=Z&codp=W
     * Eliminar (baja lógica) una inscripción usando query params.
     */
    @DeleteMapping
    public ResponseEntity<Void> delete(
            @RequestParam String codmat,
            @RequestParam Integer codpar,
            @RequestParam Integer gestion,
            @RequestParam Integer codp) {
        PrograId id = new PrograId(codmat, codpar, gestion, codp);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/progra/habilitar
     * Habilitar una inscripción previamente deshabilitada.
     */
    @PostMapping("/{codmat}/{codpar}/{gestion}/{codp}/habilitar")
    public ResponseEntity<Void> enable(
            @PathVariable String codmat,
            @PathVariable Integer codpar,
            @PathVariable Integer gestion,
            @PathVariable Integer codp) {

        PrograId id = new PrograId(codmat, codpar, gestion, codp);
        service.changeState(id, 1); // 1 = Activo

        return ResponseEntity.ok().build();
    }

    /**
     * GET /api/progra/estudiantes
     * Obtener todos los estudiantes activos para el dropdown del formulario.
     * Retorna: codp y nombre completo.
     */
    @GetMapping("/estudiantes")
    public ResponseEntity<List<AlumnoDto>> getEstudiantes() {
        return ResponseEntity.ok(service.getEstudiantes());
    }

    /**
     * GET /api/progra/mobile/alumno/{codp}/materias
     * Obtener las materias inscritas de un alumno para la app móvil.
     * Retorna formato simplificado para Ionic.
     */
    @GetMapping("/mobile/alumno/{codp}/materias")
    public ResponseEntity<List<MateriaMovilDto>> getMateriasAlumno(@PathVariable Integer codp) {
        return ResponseEntity.ok(service.getMateriasAlumno(codp));
    }
}