package com.proyecto.backend_2.features.roles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository repository;

    // --- B5. GESTION ROLES (LISTADO CON FILTROS Y PAGINACION) ---
    // Este único método reemplaza a tus 5 métodos anteriores (get, getActive,
    // getByNombre, etc.)
    public Page<RolModel> getRoles(String nombre, Integer estado, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Normalizamos los filtros para que la query funcione bien
        String filtroNombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre : null;
        Integer filtroEstado = (estado != null) ? estado : 2; // 2 = Todos

        return repository.searchRoles(filtroNombre, filtroEstado, pageable);
    }

    // --- B5.1 ADICIONAR NUEVO ROL ---
    public RolModel create(RolModel rol) {
        if (repository.existsByNombre(rol.getNombre())) {
            throw new IllegalArgumentException("Ya existe un rol con el nombre: " + rol.getNombre());
        }
        rol.setEstado(1); // Siempre activo al crear
        return repository.save(rol);
    }

    // --- B5.2 MODIFICAR ROL (¡AHORA ES SEGURO!) ---
    public RolModel update(Integer id, RolModel rolActualizado) {
        // 1. Buscamos el rol existente (con su estado actual)
        RolModel rolExistente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));

        // 2. Validamos nombre duplicado
        if (repository.existsByNombreAndNotId(rolActualizado.getNombre(), id)) {
            throw new IllegalArgumentException("Ya existe otro rol con ese nombre");
        }

        // 3. Actualizamos SOLO el nombre. Mantenemos el ID y el Estado originales.
        rolExistente.setNombre(rolActualizado.getNombre());

        return repository.save(rolExistente);
    }

    // --- B5.3 y B5.4 CAMBIO DE ESTADO ---
    @Transactional
    public void changeState(Integer id, Integer state) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Rol no encontrado");
        }
        repository.changeState(id, state);
    }

    // Método auxiliar para el modal de edición
    public RolModel getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));
    }
}