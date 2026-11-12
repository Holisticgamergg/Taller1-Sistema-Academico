package com.proyecto.backend_2.features.data;

import org.springframework.stereotype.Service;

import com.proyecto.backend_2.dtos.DataRequest;
import com.proyecto.backend_2.features.personals.PersonalModel;
import com.proyecto.backend_2.features.personals.PersonalRepository;
import com.proyecto.backend_2.ids.DataId;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataService {
    private final DataRepository repository;
    private final PersonalRepository personalRepository;

    @Transactional
    public DataModel save(DataRequest data) {
        PersonalModel p = personalRepository.findById(data.getCodp())
                .orElseThrow(
                        () -> new EntityNotFoundException("No se encontró el personal con codp: " + data.getCodp()));
        DataId id = new DataId(p.getCodp(), data.getCedula());
        return repository.save(new DataModel(id, p));
    }

    @Transactional
    public void updateCedula(Integer codp, String cedula) {
        repository.updateCedula(codp, cedula);
    }
}
