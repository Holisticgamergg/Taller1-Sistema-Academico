package com.proyecto.backend_2.features.General;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/general")
@RequiredArgsConstructor

public class GeneralController {

    private final GeneralService generalService;

    @GetMapping("/listar")
    public List<GeneralModel> listar() {
        return generalService.listar();
    }

    @PostMapping("/guardar")
    public GeneralModel guardar(@RequestBody GeneralModel g) {
        return generalService.guardar(g);
    }

    @PostMapping("/modificar/{id}")
    public GeneralModel modificar(@PathVariable String id, @RequestBody GeneralModel datos) {
        return generalService.modificar(id, datos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGeneral(@PathVariable String id) {
        generalService.deleteGeneral(id);
        return ResponseEntity.noContent().build();
    }

}
