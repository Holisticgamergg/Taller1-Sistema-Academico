package com.proyecto.backend_2.features.mepro;

import com.proyecto.backend_2.dtos.ProcesoAsignadoDto;
import com.proyecto.backend_2.ids.MeproId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/mepro")
@RequiredArgsConstructor
public class MeproController {

    private final MeproService meproService;

    @GetMapping("/asignacion")
    public List<ProcesoAsignadoDto> getProcesosParaAsignar(
            @RequestParam Integer codm,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) String tipoAsignacion) {

        return meproService.getProcesosParaAsignar(codm, filtroNombre, tipoAsignacion);
    }

    @PostMapping
    public ResponseEntity<Void> asignarProceso(@RequestBody MeproId id) {
        meproService.asignarProceso(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> desasignarProceso(
            @RequestParam Integer codm,
            @RequestParam Integer codp) {

        MeproId id = new MeproId(codm, codp);
        meproService.desasignarProceso(id);
        return ResponseEntity.ok().build();
    }
}