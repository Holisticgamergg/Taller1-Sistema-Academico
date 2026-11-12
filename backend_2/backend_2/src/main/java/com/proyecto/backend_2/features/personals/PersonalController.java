package com.proyecto.backend_2.features.personals;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_2.dtos.PersonalRequestDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/personals")
@RequiredArgsConstructor
public class PersonalController {
    private final PersonalService service;

    @GetMapping
    public List<PersonalModel> getAllPersonal() {
        return service.get();
    }

    @GetMapping("/filter")
    public List<PersonalModel> getPersonalsByFilter(@RequestParam(required = false) String tipo,
            @RequestParam(required = false) Integer estado) {
        return service.getPersonalByFilter(tipo, estado);
    }

    /**
     * GET /api/personals/{id}
     * Obtener una persona por ID con su cédula incluida.
     */
    @GetMapping("/{id}")
    public PersonalRequestDto getPersonalById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public PersonalModel savePersonal(@RequestBody PersonalRequestDto request) {
        return service.post(request);
    }

    @PutMapping("/{id}")
    public PersonalModel updatePersonal(@RequestBody PersonalRequestDto request, @PathVariable int id) {
        return service.put(request, id);
    }

    @PutMapping("/{id}/{state}")
    public void changeState(@PathVariable Integer id, @PathVariable Integer state) {
        service.changeState(id, state);
    }
}
