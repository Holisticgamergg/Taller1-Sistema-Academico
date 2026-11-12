package com.proyecto.backend_2.core.auth.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.proyecto.backend_2.core.auth.dtos.AuthResponse;
import com.proyecto.backend_2.core.auth.dtos.ChangePasswordRequest;
import com.proyecto.backend_2.core.auth.dtos.LoginRequest;
import com.proyecto.backend_2.core.auth.dtos.RegisterRequest;
import com.proyecto.backend_2.features.users.UserModel;
import com.proyecto.backend_2.features.users.UserRepository;
import com.proyecto.backend_2.features.users.services.UsuariosMenuService;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
        private final UserRepository repository;
        private final UsuariosMenuService usuariosMenuService;
        private final JwtService jwtService;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;

        public AuthResponse login(LoginRequest login) {
                authenticationManager
                                .authenticate(new UsernamePasswordAuthenticationToken(login.getLogin(),
                                                login.getPassword()));

                UserDetails user = repository.findByLogin(login.getLogin())
                                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
                String token = jwtService.getToken(user);
                return AuthResponse.builder()
                                .persona(repository.getPersonaUsuario(login.getLogin()))
                                .token(token)
                                .roles(this.usuariosMenuService.obtenerRolesMenusProcesos(login.getLogin()))
                                .build();
        }

        public AuthResponse register(RegisterRequest register) {
                UserModel userRegister = UserModel.builder()
                                .login(register.getLogin())
                                .password(passwordEncoder.encode(register.getPassword()))
                                .estado(register.getEstado())
                                .build();
                repository.save(userRegister);
                repository.changeCodp(register.getCodp(), register.getLogin());
                return AuthResponse.builder()
                                .token(jwtService.getToken(userRegister))
                                .build();
        }

        // no seguro xd (tengo miedo)
        public AuthResponse changePassword(ChangePasswordRequest request) {
                authenticationManager
                                .authenticate(new UsernamePasswordAuthenticationToken(request.getLogin(),
                                                request.getOldPassword()));

                UserModel user = repository.findByLogin(request.getLogin())
                                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                repository.save(user);

                String newToken = jwtService.getToken(user);

                return AuthResponse.builder()
                                .token(newToken)
                                .build();
        }
}