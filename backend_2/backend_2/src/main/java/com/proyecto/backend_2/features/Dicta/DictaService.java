package com.proyecto.backend_2.features.Dicta;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.exceptions.BusinessRuleException;
import com.proyecto.backend_2.exceptions.ResourceNotFoundException;
import com.proyecto.backend_2.features.Dicta.dtos.ClaseDisponibleDto;
import com.proyecto.backend_2.features.Dicta.dtos.DictaCreateDto;
import com.proyecto.backend_2.features.Dicta.dtos.DictaResponseDto;
import com.proyecto.backend_2.features.Mapa.MapaModel;
import com.proyecto.backend_2.features.Mapa.MapaRepository;
import com.proyecto.backend_2.features.users.UserModel;
import com.proyecto.backend_2.features.users.UserRepository;
import com.proyecto.backend_2.ids.DictaId;
import com.proyecto.backend_2.ids.MapaId;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestionar asignaciones docentes (DICTA).
 * Implementa eliminación lógica mediante changeState.
 */
@Service
@RequiredArgsConstructor
public class DictaService {

    private final DictaRepository dictaRepo;
    private final UserRepository userRepo;
    private final MapaRepository mapaRepo;

    /**
     * Obtener todas las asignaciones docentes con filtros.
     * 
     * @param codn   Código del nivel (null = todos)
     * @param filtro Texto para buscar en materia o profesor (null = todos)
     * @param estado 0=Inactivos, 1=Activos, 2=Todos
     * @return Lista de DictaResponseDto
     */
    public List<DictaResponseDto> getAll(Integer codn, String filtro, Integer estado) {
        List<Object[]> results = dictaRepo.findAllByFilters(codn, filtro, estado);

        return results.stream()
                .map(row -> new DictaResponseDto(
                        (String) row[0], // codmat
                        (Integer) row[1], // codpar
                        (Integer) row[2], // gestion
                        (String) row[3], // login
                        (String) row[4], // nombreNivel
                        (String) row[5], // nombreMateria
                        (String) row[6], // nombreParalelo
                        (String) row[7], // nombreProfesor
                        (Integer) row[8] // estado
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public DictaModel create(DictaCreateDto dto) {
        DictaId dictaId = new DictaId(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getLogin());

        // Verificar si ya existe la asignación
        if (dictaRepo.existeAsignacion(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getLogin())) {
            // Si existe, verificar su estado
            DictaModel existente = dictaRepo.findById(dictaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Error al verificar asignación"));

            if (existente.getEstado() == 1) {
                throw new BusinessRuleException(
                        String.format(
                                "El profesor ya está asignado a esta clase: materia=%s, paralelo=%d, gestión=%d",
                                dto.getCodmat(), dto.getCodpar(), dto.getGestion()));
            }

            dictaRepo.changeState(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getLogin(), 1);

            existente.setEstado(1);
            return existente;
        }

        // Verificar que exista el profesor
        UserModel profesor = userRepo.findById(dto.getLogin())
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado: " + dto.getLogin()));

        // Verificar que exista la clase (MAPA)
        MapaId mapaId = new MapaId(dto.getCodmat(), dto.getCodpar(), dto.getGestion());
        MapaModel clase = mapaRepo.findById(mapaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Clase no encontrada: materia=%s, paralelo=%d, gestión=%d",
                                dto.getCodmat(), dto.getCodpar(), dto.getGestion())));

        // Verificar que la clase esté activa
        if (clase.getEstado() != 1) {
            throw new BusinessRuleException("La clase no está activa");
        }

        // Crear la asignación
        DictaModel dicta = new DictaModel();
        dicta.setId(dictaId);
        dicta.setProfesor(profesor);
        dicta.setClase(clase);
        dicta.setEstado(1);

        return dictaRepo.save(dicta);
    }

    /**
     * Eliminar (baja física) una asignación docente.
     * 
     * @param id Clave compuesta de la asignación
     */
    @Transactional
    public void delete(DictaId id) {
        if (!dictaRepo.existsById(id)) {
            throw new ResourceNotFoundException("Asignación no encontrada");
        }
        dictaRepo.deleteById(id);
    }

    @Transactional
    public void update(String codmat, Integer codpar, Integer gestion, String login, DictaCreateDto dto) {
        DictaId idViejo = new DictaId(codmat, codpar, gestion, login);

        if (!dictaRepo.existsById(idViejo)) {
            throw new RuntimeException("Asignación no encontrada");
        }
        dictaRepo.changeState(codmat, codpar, gestion, login, 0);
        create(dto);
    }

    @Transactional
    public void changeState(DictaId id, Integer estado) {
        if (!dictaRepo.existsById(id)) {
            throw new RuntimeException("Asignación no encontrada");
        }
        dictaRepo.changeState(id.getCodmat(), id.getCodpar(), id.getGestion(), id.getLogin(), estado);
    }

    public List<ClaseDisponibleDto> getClasesDisponibles() {
        List<Object[]> results = mapaRepo.findClasesParaCombonative();

        return results.stream()
                .map(row -> new ClaseDisponibleDto(
                        (String) row[0], // codmat
                        (Integer) row[1], // codpar
                        (Integer) row[2], // gestion
                        (String) row[3] // descripcion
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deshabilitar(DictaId id) {
        changeState(id, 0);
    }

    @Transactional
    public void habilitar(DictaId id) {
        changeState(id, 1);
    }
}