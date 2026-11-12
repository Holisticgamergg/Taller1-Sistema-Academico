package com.proyecto.backend_2.features.Progra;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.exceptions.BusinessRuleException;
import com.proyecto.backend_2.exceptions.ResourceNotFoundException;
import com.proyecto.backend_2.features.Mapa.MapaModel;
import com.proyecto.backend_2.features.Mapa.MapaRepository;
import com.proyecto.backend_2.features.Progra.dtos.AlumnoDto;
import com.proyecto.backend_2.features.Progra.dtos.MateriaMovilDto;
import com.proyecto.backend_2.features.Progra.dtos.PrograCreateDto;
import com.proyecto.backend_2.features.Progra.dtos.PrograResponseDto;
import com.proyecto.backend_2.features.personals.PersonalModel;
import com.proyecto.backend_2.features.personals.PersonalRepository;
import com.proyecto.backend_2.ids.MapaId;
import com.proyecto.backend_2.ids.PrograId;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestionar inscripciones de alumnos (PROGRA).
 * Implementa eliminación lógica mediante changeState.
 */
@Service
@RequiredArgsConstructor
public class PrograService {

    private final PrograRepository prograRepo;
    private final PersonalRepository personalRepo;
    private final MapaRepository mapaRepo;

    /**
     * Obtener todas las inscripciones con filtros.
     * 
     * @param codn   Código del nivel (null = todos)
     * @param filtro Texto para buscar en materia o alumno (null = todos)
     * @param estado 0=Inactivos, 1=Activos, 2=Todos
     * @return Lista de PrograResponseDto
     */
    public List<PrograResponseDto> getAll(Integer codn, String filtro, Integer estado) {
        List<Object[]> results = prograRepo.findAllByFilters(codn, filtro, estado);

        return results.stream()
                .map(row -> new PrograResponseDto(
                        (String) row[0], // codmat
                        (Integer) row[1], // codpar
                        (Integer) row[2], // gestion
                        (Integer) row[3], // codp
                        (String) row[4], // nombreNivel
                        (String) row[5], // nombreMateria
                        (String) row[6], // nombreParalelo
                        (String) row[7], // nombreAlumno
                        (Integer) row[8] // estado
                ))
                .collect(Collectors.toList());
    }

    /**
     * Crear una nueva inscripción.
     * Valida que el alumno exista (tipo='E') y que la clase (MAPA) exista.
     * Si ya existe pero está deshabilitada, la reactiva.
     * Asigna estado=1 por defecto.
     * 
     * @param dto Datos de la inscripción
     * @return PrograModel creado
     */
    @Transactional
    public PrograModel create(PrograCreateDto dto) {
        PrograId prograId = new PrograId(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getCodp());

        // Verificar si ya existe la inscripción
        if (prograRepo.existeInscripcion(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getCodp())) {
            // Si existe, verificar su estado
            PrograModel existente = prograRepo.findById(prograId)
                    .orElseThrow(() -> new ResourceNotFoundException("Error al verificar inscripción"));

            if (existente.getEstado() == 1) {
                throw new BusinessRuleException(
                        String.format(
                                "El alumno ya está inscrito en esta materia: %s, paralelo=%d, gestión=%d",
                                dto.getCodmat(), dto.getCodpar(), dto.getGestion()));
            }

            // Si está deshabilitada, la reactivamos
            prograRepo.changeState(dto.getCodmat(), dto.getCodpar(), dto.getGestion(), dto.getCodp(), 1);
            existente.setEstado(1);
            return existente;
        }

        // Verificar que exista el alumno y sea de tipo 'E'
        PersonalModel alumno = personalRepo.findById(dto.getCodp())
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado: " + dto.getCodp()));

        if (!"E".equals(alumno.getTipo())) {
            throw new BusinessRuleException("La persona no es un estudiante (tipo debe ser 'E')");
        }

        if (alumno.getEstado() != 1) {
            throw new BusinessRuleException("El alumno no está activo");
        }

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

        // Obtener el login del usuario actual para auditoría
        String loginActual = SecurityContextHolder.getContext().getAuthentication().getName();

        // Crear la inscripción
        PrograModel progra = new PrograModel();
        progra.setId(prograId);
        progra.setAlumno(alumno);
        progra.setClase(clase);
        progra.setLogin(loginActual);
        progra.setEstado(1);

        return prograRepo.save(progra);
    }

    /**
     * Eliminar (baja lógica) una inscripción.
     * 
     * @param id Clave compuesta de la inscripción
     */
    @Transactional
    public void delete(PrograId id) {
        if (!prograRepo.existsById(id)) {
            throw new RuntimeException("Inscripción no encontrada");
        }
        prograRepo.changeState(id.getCodmat(), id.getCodpar(), id.getGestion(), id.getCodp(), 0);
    }

    /**
     * Cambiar el estado de una inscripción.
     * 
     * @param id     Clave compuesta
     * @param estado Nuevo estado (0=Inactivo, 1=Activo)
     */
    @Transactional
    public void changeState(PrograId id, Integer estado) {
        if (!prograRepo.existsById(id)) {
            throw new RuntimeException("Inscripción no encontrada");
        }
        prograRepo.changeState(id.getCodmat(), id.getCodpar(), id.getGestion(), id.getCodp(), estado);
    }

    /**
     * Obtener todos los estudiantes activos para el dropdown.
     * 
     * @return Lista de AlumnoDto
     */
    public List<AlumnoDto> getEstudiantes() {
        List<PersonalModel> estudiantes = personalRepo.getByFilter("E", 1);

        return estudiantes.stream()
                .map(e -> new AlumnoDto(
                        e.getCodp(),
                        String.format("%s %s %s",
                                e.getNombre(),
                                e.getAp(),
                                e.getAm() != null ? e.getAm() : "").trim()))
                .collect(Collectors.toList());
    }

    /**
     * Deshabilitar una inscripción (estado = 0).
     */
    @Transactional
    public void deshabilitar(PrograId id) {
        changeState(id, 0);
    }

    /**
     * Habilitar una inscripción (estado = 1).
     */
    @Transactional
    public void habilitar(PrograId id) {
        changeState(id, 1);
    }

    /**
     * Obtener materias inscritas de un alumno para app móvil.
     * 
     * @param codp Código del alumno
     * @return Lista de materias con formato para móvil
     */
    public List<MateriaMovilDto> getMateriasAlumno(Integer codp) {
        // Verificar que sea un alumno
        PersonalModel alumno = personalRepo.findById(codp)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado: " + codp));

        if (!"E".equals(alumno.getTipo())) {
            throw new BusinessRuleException("La persona no es un estudiante");
        }

        // Obtener materias inscritas activas
        List<Object[]> results = prograRepo.findMateriasAlumno(codp);

        return results.stream()
                .map(row -> new MateriaMovilDto(
                        (String) row[0], // codmat
                        (String) row[1], // sigla
                        (String) row[2], // materia
                        String.valueOf(row[3]), // nivel (convertir a String)
                        String.valueOf(row[4]) // paralelo (convertir a String)
                ))
                .collect(Collectors.toList());
    }
}