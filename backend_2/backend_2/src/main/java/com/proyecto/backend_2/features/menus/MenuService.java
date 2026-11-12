package com.proyecto.backend_2.features.menus;

//import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

//import com.proyecto.backend_2.dtos.MenuDto;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository repository;

    public List<MenuModel> get(String nombre, Integer estado) {
        String filtroNombre = (nombre != null) ? nombre : "";
        Integer filtroEstado = (estado != null) ? estado : 2; // 2 = "Todos"

        return repository.findWithFiltersNative(filtroNombre, filtroEstado);
    }

    public MenuModel post(MenuModel menu) {
        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN DEL ERROR 500! ---
        menu.setEstado(1); // 1 = Activo por defecto

        return repository.save(menu);
    }

    public MenuModel put(Integer codm, MenuModel menuActualizado) {
        // 1. Busca el objeto existente (que tiene estado=1)
        MenuModel menuExistente = repository.findById(codm)
                .orElseThrow(() -> new EntityNotFoundException("Menú no encontrado: " + codm));

        // 2. Actualiza SOLO el nombre
        menuExistente.setNombre(menuActualizado.getNombre());

        // 3. Guarda el objeto existente
        return repository.save(menuExistente);
    }

    @Transactional
    public void changeState(Integer id, Integer state) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Menú no encontrado: " + id);
        }
        repository.changeState(id, state);
    }

    public MenuModel getById(Integer codm) {
        return repository.findById(codm)
                .orElseThrow(() -> new EntityNotFoundException("Menú no encontrado: " + codm));
    }
}
/*
 * public List<MenuDto> getMenusRol(Integer codr) {
 * List<MenuModel> menus = repository.getMenusRol(codr);
 * List<MenuDto> menuRol = new ArrayList<>();
 * for (MenuModel x : menus) {
 * menuRol.add(new MenuDto(x.getCodm(), x.getNombre(),
 * repository.getProcesosMenu(x.getCodm())));
 * }
 * return menuRol;
 * }
 * }
 */