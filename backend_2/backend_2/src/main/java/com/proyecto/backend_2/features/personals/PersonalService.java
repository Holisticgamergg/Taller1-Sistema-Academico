package com.proyecto.backend_2.features.personals;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyecto.backend_2.dtos.PersonalRequestDto;
import com.proyecto.backend_2.exceptions.BusinessRuleException;
import com.proyecto.backend_2.exceptions.ResourceNotFoundException;
import com.proyecto.backend_2.features.data.DataModel;
import com.proyecto.backend_2.features.data.DataRepository;
import com.proyecto.backend_2.ids.DataId;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class PersonalService {
    private final PersonalRepository repository;
    private final DataRepository dataRepository;
    private final PasswordEncoder passwordEncoder;

    public List<PersonalModel> get() {
        return repository.findAll();
    }

    public List<PersonalModel> getPersonalByFilter(String tipo, Integer estado) {
        boolean tipoTodos = (tipo == null || tipo.equalsIgnoreCase("T"));
        boolean estadoTodos = (estado == null || estado == 2);

        if (tipoTodos && estadoTodos) {
            return repository.findAll();
        }
        if (!tipoTodos && estadoTodos) {
            return repository.getByType(tipo);
        }
        if (tipoTodos && !estadoTodos) {
            return repository.getByState(estado);
        }
        return repository.getByFilter(tipo, estado);
    }

    public PersonalModel post(PersonalRequestDto post) {
        // Validar que no exista un usuario con el mismo codp
        if (post.getPersona().getCodp() != null && repository.existsById(post.getPersona().getCodp())) {
            throw new BusinessRuleException(
                    "El usuario ya está registrado con el código: " + post.getPersona().getCodp());
        }
        if (post.getCedula() == null || post.getCedula().isEmpty()) {
            throw new BusinessRuleException("La cédula es obligatoria al crear un nuevo personal.");
        }
        if (repository.countByNombreCompleto(post.getPersona().getNombre(), post.getPersona().getAp(),
                post.getPersona().getAm()) > 0) {
            throw new BusinessRuleException("Ya existe una persona registrada con el nombre: "
                    + post.getPersona().getNombre() + " " + post.getPersona().getAp());
        }

        if (repository.countByCedula(post.getCedula()) > 0) {
            throw new BusinessRuleException("La Cédula " + post.getCedula() + " ya está registrada en el sistema.");
        }
        // pass encoder de spring como en el password
        post.getPersona().setNombre(passwordEncoder.encode(post.getPersona().getNombre()));

        PersonalModel p = repository.save(post.getPersona());
        if (post.getCedula() != null) {
            DataId id = new DataId(p.getCodp(), post.getCedula());
            dataRepository.save(new DataModel(id, p));
        }
        return p;
    }

    public PersonalModel put(PersonalRequestDto dto, int id) {

        PersonalModel personaDatos = dto.getPersona();
        personaDatos.setCodp(id);

        personaDatos.setNombre(passwordEncoder.encode(personaDatos.getNombre()));

        PersonalModel personaGuardada = repository.save(personaDatos);

        if (dto.getCedula() != null && !dto.getCedula().isEmpty()) {

            dataRepository.deleteByCodp(id);
            dataRepository.flush();

            DataId dataId = new DataId(id, dto.getCedula());
            dataRepository.save(new DataModel(dataId, personaGuardada));
        }

        return personaGuardada;
    }

    @Transactional
    public void changeState(Integer id, Integer state) {
        repository.changeState(id, state);
    }

    public PersonalRequestDto getById(Integer id) {
        PersonalModel persona = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada: " + id));

        String cedula = null;
        try {
            cedula = repository.getCedula(id);
        } catch (Exception e) {

            cedula = null;
        }

        return new PersonalRequestDto(persona, cedula);
    }
}
