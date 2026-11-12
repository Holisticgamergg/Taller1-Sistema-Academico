package com.proyecto.backend_2.features.mepro;

import com.proyecto.backend_2.dtos.ProcesoAsignadoDto;
import com.proyecto.backend_2.features.menus.MenuModel;
import com.proyecto.backend_2.features.process.ProcessModel;
import com.proyecto.backend_2.ids.MeproId;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeproService {

    private final MeproRepository meproRepository;
    // este es clave para usar getReference y no cargar toda la entidad
    private final EntityManager entityManager;

    /**
     * Lógica para la lista de la derecha (B-7)
     */
    public List<ProcesoAsignadoDto> getProcesosParaAsignar(Integer codm, String filtroNombre, String tipoAsignacion) {
        String filtro = (filtroNombre != null) ? filtroNombre : "";
        String tipo = (tipoAsignacion != null) ? tipoAsignacion : "TODOS";

        List<Object[]> results = meproRepository.getProcesosParaAsignar(codm, filtro, tipo);

        // Convertimos el resultado de la query (Object[]) a nuestro DTO
        return results.stream()
                .map(ProcesoAsignadoDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lógica para B-7: Marcar un checkbox (ASIGNAR)
     */
    @Transactional
    public void asignarProceso(MeproId id) {
        System.out.println("Asignando proceso con ID: " + id);
        if (!meproRepository.existsById(id)) {
            MenuModel menu = entityManager.getReference(MenuModel.class, id.getCodm());
            ProcessModel proceso = entityManager.getReference(ProcessModel.class, id.getCodp());
            MeproModel nuevaAsignacion = new MeproModel();
            nuevaAsignacion.setId(id);
            nuevaAsignacion.setMenuProceso(menu);
            nuevaAsignacion.setProcesoMenu(proceso);
            // Las relaciones (MenuModel, ProcessModel) no son necesarias
            // si solo guardas el ID, gracias a @MapsId.
            meproRepository.save(nuevaAsignacion);
        }
    }

    /**
     * Lógica para B-7: Desmarcar un checkbox (DESASIGNAR)
     */
    @Transactional
    public void desasignarProceso(MeproId id) {
        if (meproRepository.existsById(id)) {
            // Usamos borrado FÍSICO porque es una tabla de unión simple
            meproRepository.deleteById(id);
        }
    }
}