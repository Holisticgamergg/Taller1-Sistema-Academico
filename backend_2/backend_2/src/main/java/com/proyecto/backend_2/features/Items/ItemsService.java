package com.proyecto.backend_2.features.Items;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemsService {

    private final ItemsRepository itemsRepo;

    /**
     * B-11. GESTIÓN ITEMS - Listado con filtros.
     * 
     * @param nombre Filtro opcional por nombre
     * @param estado Filtro por estado (null o 2 = todos, 1 = activos, 0 =
     *               inactivos)
     * @return Lista de items filtrados
     */
    public List<ItemsModel> getAll(String nombre, Integer estado) {
        // Normalizamos los filtros
        String filtroNombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre : null;
        Integer filtroEstado = (estado != null) ? estado : 2; // 2 = Todos

        return itemsRepo.findWithFiltersNative(filtroNombre, filtroEstado);
    }

    /**
     * Listar solo items activos (para dropdown en otras pantallas).
     * 
     * @return Lista de items con estado = 1
     */
    public List<ItemsModel> listarActivos() {
        return itemsRepo.findAllActivos();
    }

    /**
     * B-11. ADICIONAR NUEVO ITEM.
     * 
     * @param item Datos del item a crear
     * @return Item creado
     */
    public ItemsModel create(ItemsModel item) {
        // Validar que no exista un item con el mismo nombre
        if (itemsRepo.existsByNombreIgnoreCase(item.getNombre())) {
            throw new IllegalArgumentException("Ya existe un item con el nombre: " + item.getNombre());
        }

        // Asignar estado activo por defecto
        item.setEstado(1);

        return itemsRepo.save(item);
    }

    /**
     * B-11. MODIFICAR ITEM.
     * 
     * @param codi            ID del item a modificar
     * @param itemActualizado Datos actualizados
     * @return Item modificado
     */
    public ItemsModel update(Integer codi, ItemsModel itemActualizado) {
        // 1. Buscar el item existente
        ItemsModel itemExistente = itemsRepo.findById(codi)
                .orElseThrow(() -> new EntityNotFoundException("Item no encontrado con ID: " + codi));

        // 2. Validar que no exista otro item con el mismo nombre
        if (itemsRepo.existsByNombreAndNotId(itemActualizado.getNombre(), codi)) {
            throw new IllegalArgumentException("Ya existe otro item con el nombre: " + itemActualizado.getNombre());
        }

        // 3. Actualizar solo el nombre (mantenemos ID y estado originales)
        itemExistente.setNombre(itemActualizado.getNombre());

        return itemsRepo.save(itemExistente);
    }

    /**
     * B-11. CAMBIO DE ESTADO (Eliminar/Habilitar).
     * 
     * @param codi   ID del item
     * @param estado Nuevo estado (0 = eliminar, 1 = habilitar)
     */
    @Transactional
    public void changeState(Integer codi, Integer estado) {
        if (!itemsRepo.existsById(codi)) {
            throw new RuntimeException("Item no encontrado con ID: " + codi);
        }

        itemsRepo.changeState(codi, estado);
    }

    /**
     * Obtener un item por su ID (para modal de edición).
     * 
     * @param codi ID del item
     * @return Item encontrado
     */
    public ItemsModel getById(Integer codi) {
        return itemsRepo.findById(codi)
                .orElseThrow(() -> new EntityNotFoundException("Item no encontrado con ID: " + codi));
    }
}