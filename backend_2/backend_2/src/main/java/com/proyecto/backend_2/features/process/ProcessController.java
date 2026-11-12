package com.proyecto.backend_2.features.process;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/process")
@RequiredArgsConstructor
public class ProcessController {
    private final ProcessService service;

    @GetMapping
    public List<ProcessModel> getAllProcesses() {
        return service.get();
    }
}
