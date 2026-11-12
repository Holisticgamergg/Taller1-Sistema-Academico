package com.proyecto.backend_2.features.usurol;

import com.proyecto.backend_2.dtos.RolAsignadoDto;
import com.proyecto.backend_2.features.roles.RolModel;
import com.proyecto.backend_2.features.users.UserModel;
import com.proyecto.backend_2.ids.UsurolId;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsurolService {

    private final UsurolRepository usurolRepository;
    private final EntityManager entityManager;

    /**
     * B-9. ASIGNAR ROLES A UN USUARIO - Lista de roles con flag de asignación.
     * 
     * @param login          Login del usuario seleccionado
     * @param filtroNombre   Filtro opcional por nombre del rol
     * @param tipoAsignacion 'TODOS', 'SI', 'NO'
     * @return Lista de roles con flag asignado
     */
    public List<RolAsignadoDto> getRolesParaAsignar(String login, String filtroNombre, String tipoAsignacion) {
        String filtro = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre : null;

        // Validar y normalizar tipoAsignacion
        String tipo = "TODOS"; // valor por defecto
        if (tipoAsignacion != null && !tipoAsignacion.trim().isEmpty()) {
            String tipoUpper = tipoAsignacion.trim().toUpperCase();
            if (tipoUpper.equals("SI") || tipoUpper.equals("NO") || tipoUpper.equals("TODOS")) {
                tipo = tipoUpper;
            }
        }

        List<Object[]> results = usurolRepository.getRolesParaAsignar(login, filtro, tipo);

        return results.stream()
                .map(RolAsignadoDto::new)
                .collect(Collectors.toList());
    }

    /**
     * B-9. Asignar un rol a un usuario (marcar checkbox).
     * 
     * @param id Clave compuesta (login, codr)
     */
    @Transactional
    public void asignarRol(UsurolId id) {
        if (!usurolRepository.existsById(id)) {
            // Usar getReference para evitar cargar entidades completas
            UserModel usuario = entityManager.getReference(UserModel.class, id.getLogin());
            RolModel rol = entityManager.getReference(RolModel.class, id.getCodr());

            UsurolModel nuevaAsignacion = new UsurolModel();
            nuevaAsignacion.setId(id);
            nuevaAsignacion.setUsuarioRol(usuario);
            nuevaAsignacion.setRolUsuario(rol);

            usurolRepository.save(nuevaAsignacion);
        }
    }

    /**
     * B-9. Desasignar un rol de un usuario (desmarcar checkbox).
     * 
     * @param id Clave compuesta (login, codr)
     */
    @Transactional
    public void desasignarRol(UsurolId id) {
        if (usurolRepository.existsById(id)) {
            // Eliminación física (es una tabla de relación simple)
            usurolRepository.deleteById(id);
        }
    }
}
