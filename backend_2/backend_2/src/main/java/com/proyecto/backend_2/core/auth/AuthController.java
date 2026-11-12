package com.proyecto.backend_2.core.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_2.core.auth.dtos.AuthResponse;
import com.proyecto.backend_2.core.auth.dtos.ChangePasswordRequest;
import com.proyecto.backend_2.core.auth.dtos.LoginRequest;
import com.proyecto.backend_2.core.auth.dtos.RegisterRequest;
import com.proyecto.backend_2.core.auth.services.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest login) {
        System.out.println("Login attempt for user: " + login.getLogin());
        return ResponseEntity.ok(service.login(login));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest register) {
        return ResponseEntity.ok(service.register(register));
    }

    @PutMapping("/change-password")
    public AuthResponse changePassword(@RequestBody ChangePasswordRequest request) {
        return service.changePassword(request);
    }
}
