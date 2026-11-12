package com.proyecto.backend_2.features.rolme;

import com.proyecto.backend_2.dtos.MenuAsignadoDto;
import com.proyecto.backend_2.features.menus.MenuModel;
import com.proyecto.backend_2.features.roles.RolModel;
import com.proyecto.backend_2.ids.RolmeId;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolmeService {

    private final RolmeRepository rolmeRepository;
    private final EntityManager entityManager;

    /**
     * B-8. ASIGNAR MENÚS A UN ROL - Lista de menús con flag de asignación.
     * 
     * @param codr           Código del rol seleccionado
     * @param filtroNombre   Filtro opcional por nombre del menú
     * @param tipoAsignacion 'TODOS', 'SI', 'NO'
     * @return Lista de menús con flag asignado
     */
    public List<MenuAsignadoDto> getMenusParaAsignar(Integer codr, String filtroNombre, String tipoAsignacion) {
        String filtro = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre : null;
        String tipo = (tipoAsignacion != null) ? tipoAsignacion : "TODOS";

        List<Object[]> results = rolmeRepository.getMenusParaAsignar(codr, filtro, tipo);

        return results.stream()
                .map(MenuAsignadoDto::new)
                .collect(Collectors.toList());
    }

    /**
     * B-8. Asignar un menú a un rol (marcar checkbox).
     * 
     * @param id Clave compuesta (codr, codm)
     */
    @Transactional
    public void asignarMenu(RolmeId id) {
        if (!rolmeRepository.existsById(id)) {
            // Usar getReference para evitar cargar entidades completas
            RolModel rol = entityManager.getReference(RolModel.class, id.getCodr());
            MenuModel menu = entityManager.getReference(MenuModel.class, id.getCodm());

            RolmeModel nuevaAsignacion = new RolmeModel();
            nuevaAsignacion.setId(id);
            nuevaAsignacion.setRolMenu(rol);
            nuevaAsignacion.setMenuRol(menu);

            rolmeRepository.save(nuevaAsignacion);
        }
    }

    /**
     * B-8. Desasignar un menú de un rol (desmarcar checkbox).
     * 
     * @param id Clave compuesta (codr, codm)
     */
    @Transactional
    public void desasignarMenu(RolmeId id) {
        if (rolmeRepository.existsById(id)) {
            // Eliminación física (es una tabla de relación simple)
            rolmeRepository.deleteById(id);
        }
    }
}
