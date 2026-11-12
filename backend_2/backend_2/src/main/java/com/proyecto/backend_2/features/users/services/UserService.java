package com.proyecto.backend_2.features.users.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proyecto.backend_2.features.users.UserModel;
import com.proyecto.backend_2.features.users.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public List<UserModel> get() {
        return repository.findAll();
    }
}
