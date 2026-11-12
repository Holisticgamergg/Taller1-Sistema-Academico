package com.proyecto.backend_2.features.General;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // constructor para inyectar dependencias

public class GeneralService {

    private final GeneralRepository generalRepository;

    public List<GeneralModel> listar() {
        return generalRepository.findAll();
    }

    public GeneralModel guardar(GeneralModel g) {
        return generalRepository.save(g);
    }

    public GeneralModel modificar(String id, GeneralModel datos) {
        GeneralModel g = generalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("General no existe"));
        g.setCodg(datos.getCodg());
        g.setGestion(datos.getGestion());
        return generalRepository.save(g);
    }

    public void deleteGeneral(String id) {
        GeneralModel g = generalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("General no existe"));
        generalRepository.delete(g);
    }
}