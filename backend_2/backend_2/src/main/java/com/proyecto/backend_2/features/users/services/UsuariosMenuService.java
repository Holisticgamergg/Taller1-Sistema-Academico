package com.proyecto.backend_2.features.users.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.proyecto.backend_2.dtos.MenuDto;
import com.proyecto.backend_2.dtos.ProcessDto;
import com.proyecto.backend_2.dtos.RolDto;
import com.proyecto.backend_2.features.menus.MenuModel;
import com.proyecto.backend_2.features.mepro.MeproRepository;
import com.proyecto.backend_2.features.process.ProcessModel;
import com.proyecto.backend_2.features.roles.RolModel;
import com.proyecto.backend_2.features.rolme.RolmeRepository;
import com.proyecto.backend_2.features.usurol.UsurolRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuariosMenuService {
    private final UsurolRepository usurol;
    private final RolmeRepository rolme;
    private final MeproRepository mepro;

    public List<RolDto> obtenerRolesMenusProcesos(String login) {
        List<RolDto> rolDtos = new ArrayList<>();

        // 1) Trae roles del usuario
        List<RolModel> roles = new ArrayList<>(usurol.findRolesByLogin(login));

        for (RolModel rol : roles) {
            RolDto rolDto = new RolDto();
            rolDto.setCodr(rol.getCodr());
            rolDto.setNombre(rol.getNombre());
            rolDto.setEstado(rol.getEstado());

            // 2) Trae menús del rol
            List<MenuModel> menus = rolme.findMenuByRol(rol.getCodr());
            List<MenuDto> menuDtos = new ArrayList<>();

            for (MenuModel menu : menus) {
                MenuDto menuDto = new MenuDto();
                menuDto.setCodm(menu.getCodm());
                menuDto.setNombre(menu.getNombre());

                // 3) Trae procesos del menú
                List<ProcessModel> procesos = mepro.findByMenuCodm(menu.getCodm());
                List<ProcessDto> procesoDtos = new ArrayList<>();

                for (ProcessModel p : procesos) {
                    ProcessDto procDto = new ProcessDto(
                            p.getNombre(),
                            p.getAyuda(),
                            p.getEnlace());
                    procesoDtos.add(procDto);
                }

                menuDto.setProcesos(procesoDtos);
                menuDtos.add(menuDto);
            }

            rolDto.setMenus(menuDtos);
            rolDtos.add(rolDto);
        }

        return rolDtos;
    }

}