package com.proyecto.backend_2.features.niveles;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NivelesService {

    private final NivelesRepository nivelesRepo;

    /**
     * B-13. GESTIÓN NIVELES - Listado con filtros.
     * 
     * @param nombre Filtro opcional por nombre
     * @param estado Filtro por estado (null o 2 = todos, 1 = activos, 0 =
     *               inactivos)
     * @return Lista de niveles filtrados
     */
    public List<NivelesModel> getAll(String nombre, Integer estado) {
        // Normalizamos los filtros
        String filtroNombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre : null;
        Integer filtroEstado = (estado != null) ? estado : 2; // 2 = Todos

        return nivelesRepo.findWithFiltersNative(filtroNombre, filtroEstado);
    }

    /**
     * Listar solo niveles activos (para dropdown en Materias).
     * 
     * @return Lista de niveles con estado = 1
     */
    public List<NivelesModel> listarActivos() {
        return nivelesRepo.findAllActivos();
    }

    /**
     * B-13.1. ADICIONAR NUEVO NIVEL.
     * 
     * @param nivel Datos del nivel a crear
     * @return Nivel creado
     */
    public NivelesModel post(NivelesModel nivel) {
        // Validar que no exista un nivel con el mismo nombre
        if (nivelesRepo.existsByNombreIgnoreCase(nivel.getNombre())) {
            throw new IllegalArgumentException("Ya existe un nivel con el nombre: " + nivel.getNombre());
        }

        // Asignar estado activo por defecto
        nivel.setEstado(1);

        return nivelesRepo.save(nivel);
    }

    /**
     * B-13.2. MODIFICAR NIVEL.
     * 
     * @param codn             ID del nivel a modificar
     * @param nivelActualizado Datos actualizados
     * @return Nivel modificado
     */
    public NivelesModel put(Integer codn, NivelesModel nivelActualizado) {
        // Validar que codn no sea nulo
        if (codn == null) {
            throw new IllegalArgumentException("El ID del nivel no puede ser nulo");
        }

        // 1. Buscar el nivel existente
        NivelesModel nivelExistente = nivelesRepo.findById(codn)
                .orElseThrow(() -> new EntityNotFoundException("Nivel no encontrado con ID: " + codn));

        // 2. Validar que no exista otro nivel con el mismo nombre
        if (nivelesRepo.existsByNombreAndNotId(nivelActualizado.getNombre(), codn)) {
            throw new IllegalArgumentException("Ya existe otro nivel con el nombre: " + nivelActualizado.getNombre());
        }

        // 3. Actualizar solo el nombre (mantenemos ID y estado originales)
        nivelExistente.setNombre(nivelActualizado.getNombre());

        return nivelesRepo.save(nivelExistente);
    }

    /**
     * B-13.3 y B-13.4. CAMBIO DE ESTADO (Eliminar/Habilitar).
     * 
     * @param codn   ID del nivel
     * @param estado Nuevo estado (0 = eliminar, 1 = habilitar)
     */
    @Transactional
    public void changeState(Integer codn, Integer estado) {
        // Validar que codn no sea nulo
        if (codn == null) {
            throw new IllegalArgumentException("El ID del nivel no puede ser nulo");
        }

        // Verificar que el nivel existe
        if (!nivelesRepo.existsById(codn)) {
            throw new EntityNotFoundException("Nivel no encontrado con ID: " + codn);
        }

        nivelesRepo.changeState(codn, estado);
    }

    /**
     * Obtener un nivel por su ID (para modal de edición).
     * 
     * @param codn ID del nivel
     * @return Nivel encontrado
     */
    public NivelesModel getById(Integer codn) {
        if (codn == null) {
            throw new IllegalArgumentException("El ID del nivel no puede ser nulo");
        }
        return nivelesRepo.findById(codn)
                .orElseThrow(() -> new EntityNotFoundException("Nivel no encontrado con ID: " + codn));
    }
}
