package com.proyecto.backend_2.features.data;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_2.dtos.DataRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
public class DataController {
    private final DataService service;

    @PostMapping
    public DataModel saveData(@RequestBody DataRequest data) {
        return service.save(data);
    }

    @PutMapping("/{codp}/{cedula}")
    public void updateData(@PathVariable Integer codp, @PathVariable String cedula) {
        service.updateCedula(codp, cedula);
    }
}
