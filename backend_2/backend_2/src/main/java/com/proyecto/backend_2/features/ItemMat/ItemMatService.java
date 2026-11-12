package com.proyecto.backend_2.features.ItemMat;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.backend_2.dtos.ItematCreateDto;
import com.proyecto.backend_2.dtos.ItematResponseDto;
import com.proyecto.backend_2.exceptions.BusinessRuleException;
import com.proyecto.backend_2.exceptions.ResourceNotFoundException;
import com.proyecto.backend_2.features.General.GeneralRepository;
import com.proyecto.backend_2.features.Items.ItemsModel;
import com.proyecto.backend_2.features.Items.ItemsRepository;
import com.proyecto.backend_2.features.Materias.MateriasModel;
import com.proyecto.backend_2.features.Materias.MateriasRepository;
import com.proyecto.backend_2.ids.ItematId;

import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Service para gestionar asignaciones Item-Materia.
 * Implementa eliminación lógica mediante changeState.
 * La gestión se obtiene automáticamente desde la tabla GENERAL.
 */
@Service
@RequiredArgsConstructor
public class ItemMatService {

    private final ItemMatRepository itemMatRepo;
    private final MateriasRepository materiasRepo;
    private final ItemsRepository itemsRepo;
    private final GeneralRepository generalRepo;

    public List<ItematResponseDto> getItemsAsignados(String codmat) {
        // Obtener gestión actual desde GENERAL
        Integer gestion = obtenerGestionActual();

        List<Object[]> results = itemMatRepo.findItemsAsignadosNative(codmat, gestion);

        return results.stream()
                .map(ItematResponseDto::new) // Usa el constructor que creamos
                .toList();
    }

    public List<ItematModel> listar() {
        return itemMatRepo.findAll();
    }

    /**
     * Buscar una asignación específica por su clave compuesta
     */
    public ItematModel buscarPorId(ItematId id) {
        return itemMatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        String.format("Asignación no encontrada: materia=%s, item=%d, gestión=%d",
                                id.getCodmat(), id.getCodi(), id.getGestion())));
    }

    @Transactional
    public ItematModel asignarItem(ItematCreateDto dto) {
        // Obtener gestión actual desde GENERAL
        Integer gestion = obtenerGestionActual();

        if (itemMatRepo.existeAsignacion(dto.getCodmat(), dto.getCodi(), gestion)) {
            throw new BusinessRuleException(
                    String.format("Ya existe una asignación: materia=%s, item=%d, gestión=%d",
                            dto.getCodmat(), dto.getCodi(), gestion));
        }

        Integer sumaActual = itemMatRepo.sumarPonderacionPorMateria(dto.getCodmat(), gestion);
        int nuevaSuma = sumaActual + dto.getPonderacion();

        if (nuevaSuma > 100) {
            int disponible = 100 - sumaActual;
            throw new BusinessRuleException("La ponderación excede el 100%. Disponible: " + disponible + "%");
        }

        MateriasModel materia = materiasRepo.findById(dto.getCodmat())
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + dto.getCodmat()));

        ItemsModel item = itemsRepo.findById(dto.getCodi())
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado: " + dto.getCodi()));

        ItematId id = new ItematId(dto.getCodmat(), dto.getCodi(), gestion);

        ItematModel itemat = new ItematModel();
        itemat.setId(id);
        itemat.setMateria(materia);
        itemat.setItem(item);
        itemat.setPonderacion(dto.getPonderacion());
        itemat.setEstado(1);

        return itemMatRepo.save(itemat);
    }

    @Transactional
    public ItematModel actualizarPonderacion(ItematId id, ItematCreateDto dto) {
        ItematModel itemat = itemMatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        String.format("Asignación no encontrada: materia=%s, item=%d, gestión=%d",
                                id.getCodmat(), id.getCodi(), id.getGestion())));

        itemat.setPonderacion(dto.getPonderacion());

        return itemMatRepo.save(itemat);
    }

    @Transactional
    public void changeState(ItematId id, Integer estado) {

        if (!itemMatRepo.existeAsignacion(id.getCodmat(), id.getCodi(), id.getGestion())) {
            throw new RuntimeException(
                    String.format("Asignación no encontrada: materia=%s, item=%d, gestión=%d",
                            id.getCodmat(), id.getCodi(), id.getGestion()));
        }

        itemMatRepo.changeState(id.getCodmat(), id.getCodi(), id.getGestion(), estado);
    }

    @Transactional
    public void eliminar(ItematId id) {
        changeState(id, 0);
    }

    @Transactional
    public void habilitar(ItematId id) {
        changeState(id, 1);
    }

    private Integer obtenerGestionActual() {
        return generalRepo.findAll().stream()
                .findFirst()
                .map(g -> g.getGestion())
                .orElseThrow(() -> new RuntimeException(
                        "No se encontró la gestión actual en GENERAL. Configure la gestión primero."));
    }
}
