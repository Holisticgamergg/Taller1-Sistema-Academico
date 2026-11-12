package com.proyecto.backend_2.features.process;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProcessService {
    private final ProcessRepository repository;

    public List<ProcessModel> get() {
        return repository.findAll();
    }
}
