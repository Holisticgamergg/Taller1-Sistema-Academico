package com.proyecto.backend_2.features.Paralelos;

import java.util.List;
import org.springframework.stereotype.Service;
import com.proyecto.backend_2.dtos.ParaleloDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParalelosService {

    private final ParalelosRepository paralelosRepo;

    public List<ParalelosModel> listar() {
        return paralelosRepo.findAll();
    }

    public List<ParalelosModel> getFiltrado(String nombre, Integer estado) {
        // Si nombre viene vacío, lo convertimos a null para la query
        String nombreFiltro = (nombre == null || nombre.trim().isEmpty()) ? null : nombre.trim();
        return paralelosRepo.findByFiltros(nombreFiltro, estado);
    }

    public ParalelosModel buscarPorId(Integer id) {
        if (id == null) {
            throw new RuntimeException("El ID no puede ser nulo");
        }
        return paralelosRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paralelo no encontrado con ID: " + id));
    }

    public ParalelosModel crear(ParaleloDto dto) {
        ParalelosModel paralelo = new ParalelosModel();
        paralelo.setNombre(dto.getNombre());
        paralelo.setEstado(1);
        return paralelosRepo.save(paralelo);
    }

    public ParalelosModel actualizar(Integer id, ParaleloDto dto) {
        if (id == null) {
            throw new RuntimeException("El ID no puede ser nulo");
        }
        ParalelosModel paralelo = paralelosRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paralelo no encontrado con ID: " + id));

        paralelo.setNombre(dto.getNombre());

        return paralelosRepo.save(paralelo);
    }

    public void eliminar(Integer id) {
        if (id == null) {
            throw new RuntimeException("El ID no puede ser nulo");
        }
        ParalelosModel paralelo = paralelosRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paralelo no encontrado con ID: " + id));

        paralelo.setEstado(0);
        paralelosRepo.save(paralelo);
    }

    public void habilitar(Integer id) {
        if (id == null) {
            throw new RuntimeException("El ID no puede ser nulo");
        }
        ParalelosModel paralelo = paralelosRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paralelo no encontrado con ID: " + id));

        paralelo.setEstado(1);
        paralelosRepo.save(paralelo);
    }
}
