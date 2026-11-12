package com.proyecto.backend_2.features.Materias;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.exceptions.BusinessRuleException;
import com.proyecto.backend_2.exceptions.ResourceNotFoundException;
import com.proyecto.backend_2.features.Materias.dtos.MateriaRequestDto;
import com.proyecto.backend_2.features.Materias.dtos.MateriaResponseDto;
import com.proyecto.backend_2.features.niveles.NivelesModel;
import com.proyecto.backend_2.features.niveles.NivelesRepository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service para gestión de MATERIAS
 * Implementa validaciones de FK y eliminación lógica
 */
@Service
@RequiredArgsConstructor
public class MateriasService {

    private final MateriasRepository materiasRepo;
    private final NivelesRepository nivelesRepo;
    private final EntityManager entityManager;

    /**
     * B-12. GESTIÓN MATERIAS - Listado con filtros.
     * 
     * @param nombre Filtro opcional por nombre
     * @param estado Filtro por estado (null o 2 = todos, 1 = activos, 0 =
     *               inactivos)
     * @return Lista de materias filtradas
     */
    public List<MateriaResponseDto> getAll(String nombre, Integer estado) {
        // Normalizamos los filtros
        String filtroNombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre : null;
        Integer filtroEstado = (estado != null) ? estado : 2; // 2 = Todos

        return materiasRepo.findWithFiltersNative(filtroNombre, filtroEstado)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Obtener una materia por su ID.
     * 
     * @param codmat Código de la materia
     * @return Materia encontrada
     */
    public MateriaResponseDto getById(String codmat) {
        MateriasModel materia = materiasRepo.findById(codmat)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada con código: " + codmat));
        return toResponseDto(materia);
    }

    /**
     * B-12. ADICIONAR NUEVA MATERIA.
     * 
     * @param dto Datos de la materia (el usuario provee codmat)
     * @return Materia creada
     */
    @Transactional
    public MateriaResponseDto create(MateriaRequestDto dto) {
        // Validación 1: Verificar que codmat no exista
        if (materiasRepo.existsByCodmat(dto.getCodmat())) {
            throw new IllegalArgumentException("Ya existe una materia con el código: " + dto.getCodmat());
        }

        // Validación 2: Verificar que codn (Nivel) exista
        if (dto.getCodn() == null) {
            throw new IllegalArgumentException("El código de nivel (codn) es obligatorio");
        }

        NivelesModel nivel = nivelesRepo.findById(dto.getCodn())
                .orElseThrow(() -> new IllegalArgumentException("El nivel con código " + dto.getCodn() + " no existe"));

        // Crear la entidad
        MateriasModel materia = new MateriasModel();
        materia.setCodmat(dto.getCodmat());
        materia.setNombre(dto.getNombre());
        materia.setEstado(1); // Estado activo por defecto
        materia.setNivel(nivel);

        MateriasModel saved = materiasRepo.save(materia);
        return toResponseDto(saved);
    }

    /**
     * B-12. MODIFICAR MATERIA.
     * 
     * @param codmat Código de la materia a modificar
     * @param dto    Datos actualizados
     * @return Materia modificada
     */
    @Transactional
    public MateriaResponseDto update(String codmat, MateriaRequestDto dto) {
        // 1. Buscar la materia existente
        MateriasModel materiaExistente = materiasRepo.findById(codmat)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada con código: " + codmat));

        // 2. Validar que el nuevo codn exista
        if (dto.getCodn() != null) {
            NivelesModel nivel = nivelesRepo.findById(dto.getCodn())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El nivel con código " + dto.getCodn() + " no existe"));
            materiaExistente.setNivel(nivel);
        }

        // 3. Actualizar solo nombre (mantiene codmat y estado originales)
        materiaExistente.setNombre(dto.getNombre());

        MateriasModel saved = materiasRepo.save(materiaExistente);
        return toResponseDto(saved);
    }

    /**
     * B-12. CAMBIO DE ESTADO (Eliminar/Habilitar).
     * 
     * @param codmat Código de la materia
     * @param estado Nuevo estado (0 = eliminar, 1 = habilitar)
     */
    @Transactional
    public void changeState(String codmat, Integer estado) {
        // Verificar que la materia existe
        if (!materiasRepo.existsById(codmat)) {
            throw new RuntimeException("Materia no encontrada con código: " + codmat);
        }

        materiasRepo.changeState(codmat, estado);
    }

    @Transactional
    public void updateCodigo(String oldCodmat, String newCodmat) {

        if (!materiasRepo.existsById(oldCodmat)) {
            throw new ResourceNotFoundException("Materia no encontrada con código: " + oldCodmat);
        }

        if (materiasRepo.existsByCodmat(newCodmat)) {
            throw new BusinessRuleException("Ya existe una materia con el código: " + newCodmat);
        }

        if (newCodmat == null || newCodmat.trim().isEmpty()) {
            throw new BusinessRuleException("El nuevo código no puede estar vacío");
        }

        if (newCodmat.length() > 15) {
            throw new BusinessRuleException("El código no puede tener más de 15 caracteres");
        }

        entityManager.createNativeQuery(
                "UPDATE progra SET codmat = :newCodmat WHERE codmat = :oldCodmat")
                .setParameter("newCodmat", newCodmat)
                .setParameter("oldCodmat", oldCodmat)
                .executeUpdate();

        entityManager.createNativeQuery(
                "UPDATE dicta SET codmat = :newCodmat WHERE codmat = :oldCodmat")
                .setParameter("newCodmat", newCodmat)
                .setParameter("oldCodmat", oldCodmat)
                .executeUpdate();

        entityManager.createNativeQuery(
                "UPDATE itemat SET codmat = :newCodmat WHERE codmat = :oldCodmat")
                .setParameter("newCodmat", newCodmat)
                .setParameter("oldCodmat", oldCodmat)
                .executeUpdate();

        entityManager.createNativeQuery(
                "UPDATE mapa SET codmat = :newCodmat WHERE codmat = :oldCodmat")
                .setParameter("newCodmat", newCodmat)
                .setParameter("oldCodmat", oldCodmat)
                .executeUpdate();

        materiasRepo.updateCodmat(oldCodmat, newCodmat);

        entityManager.flush();
    }

    private MateriaResponseDto toResponseDto(MateriasModel model) {
        return new MateriaResponseDto(
                model.getCodmat(),
                model.getNombre(),
                model.getEstado(),
                model.getCodn(),
                model.getNivel() != null ? model.getNivel().getNombre() : null);
    }
}