package com.proyecto.backend_2.features.Mapa;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.dtos.MapaCreateDto;
import com.proyecto.backend_2.dtos.MapaResponseDto;
import com.proyecto.backend_2.features.General.GeneralRepository;
import com.proyecto.backend_2.features.Materias.MateriasModel;
import com.proyecto.backend_2.features.Materias.MateriasRepository;
import com.proyecto.backend_2.features.Paralelos.ParalelosModel;
import com.proyecto.backend_2.features.Paralelos.ParalelosRepository;
import com.proyecto.backend_2.ids.MapaId;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service para gestionar asignaciones Materia-Paralelo.
 * Implementa eliminación lógica mediante changeState.
 * La gestión se obtiene automáticamente desde la tabla GENERAL.
 */
@Service
@RequiredArgsConstructor
public class MapaService {

    private final MapaRepository mapaRepo;
    private final MateriasRepository materiasRepo;
    private final ParalelosRepository paralelosRepo;
    private final GeneralRepository generalRepo;

    /**
     * B-12.1. Obtener todos los paralelos asignados a una materia.
     * La gestión se obtiene automáticamente desde GENERAL.
     * Incluye el nombre del paralelo mediante JOIN.
     * 
     * @param codmat Código de la materia
     * @return Lista de MapaResponseDto
     */
    public List<MapaResponseDto> getParalelosAsignados(String codmat) {
        // Obtener gestión actual desde GENERAL
        Integer gestion = obtenerGestionActual();

        List<Object[]> results = mapaRepo.findParalelosAsignadosNative(codmat, gestion);

        return results.stream()
                .map(row -> new MapaResponseDto(
                        (String) row[0], // codmat
                        (Integer) row[1], // codpar
                        (Integer) row[2], // gestion
                        (String) row[3], // nombreParalelo
                        (Integer) row[4] // estado
                ))
                .collect(Collectors.toList());
    }

    /**
     * Listar todas las asignaciones.
     */
    public List<MapaModel> listar() {
        return mapaRepo.findAll();
    }

    /**
     * Buscar una asignación específica por su clave compuesta.
     */
    public MapaModel buscarPorId(MapaId id) {
        return mapaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        String.format("Asignación no encontrada: materia=%s, paralelo=%d, gestión=%d",
                                id.getCodmat(), id.getCodpar(), id.getGestion())));
    }

    /**
     * B-12.1. Asignar un paralelo a una materia (crear nueva asignación).
     * La gestión se obtiene automáticamente desde GENERAL.
     * Asigna estado = 1 por defecto.
     * 
     * @param dto Datos de la asignación (codmat, codpar)
     * @return MapaModel creado
     */
    @Transactional
    public MapaModel asignarParalelo(MapaCreateDto dto) {
        // Obtener gestión actual desde GENERAL
        Integer gestion = obtenerGestionActual();

        // Verificar que no exista ya la asignación
        if (mapaRepo.existeAsignacion(dto.getCodmat(), dto.getCodpar(), gestion)) {
            throw new RuntimeException(
                    String.format("Ya existe una asignación: materia=%s, paralelo=%d, gestión=%d",
                            dto.getCodmat(), dto.getCodpar(), gestion));
        }

        // Verificar que exista la materia
        MateriasModel materia = materiasRepo.findById(dto.getCodmat())
                .orElseThrow(() -> new RuntimeException("Materia no encontrada: " + dto.getCodmat()));

        // Verificar que exista el paralelo
        ParalelosModel paralelo = paralelosRepo.findById(dto.getCodpar())
                .orElseThrow(() -> new RuntimeException("Paralelo no encontrado: " + dto.getCodpar()));

        // Crear la clave compuesta
        MapaId id = new MapaId(dto.getCodmat(), dto.getCodpar(), gestion);

        // Crear la nueva asignación
        MapaModel mapa = new MapaModel();
        mapa.setId(id);
        mapa.setMaterias(materia);
        mapa.setParalelos(paralelo);
        mapa.setEstado(1); // Estado activo por defecto

        return mapaRepo.save(mapa);
    }

    /**
     * Cambiar el estado de una asignación (eliminación lógica o habilitación).
     * 
     * @param id     Clave compuesta de la asignación
     * @param estado Nuevo estado (0=Baja lógica, 1=Activo)
     */
    @Transactional
    public void changeState(MapaId id, Integer estado) {
        // Verificar que existe la asignación
        if (!mapaRepo.existeAsignacion(id.getCodmat(), id.getCodpar(), id.getGestion())) {
            throw new RuntimeException(
                    String.format("Asignación no encontrada: materia=%s, paralelo=%d, gestión=%d",
                            id.getCodmat(), id.getCodpar(), id.getGestion()));
        }

        // Cambiar el estado usando query nativa
        mapaRepo.changeState(id.getCodmat(), id.getCodpar(), id.getGestion(), estado);
    }

    /**
     * Eliminar una asignación (eliminación lógica: estado = 0).
     */
    @Transactional
    public void eliminar(MapaId id) {
        changeState(id, 0);
    }

    /**
     * Habilitar una asignación (estado = 1).
     */
    @Transactional
    public void habilitar(MapaId id) {
        changeState(id, 1);
    }

    /**
     * Obtener la gestión actual desde la tabla GENERAL.
     * La tabla GENERAL tiene un único registro que almacena la gestión vigente.
     * 
     * @return Gestión actual
     */
    private Integer obtenerGestionActual() {
        return generalRepo.findAll().stream()
                .findFirst()
                .map(g -> g.getGestion())
                .orElseThrow(() -> new RuntimeException(
                        "No se encontró la gestión actual en GENERAL. Configure la gestión primero."));
    }
}