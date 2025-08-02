package com.eustache.users_service.controllers;

import com.eustache.users_service.DTO.requests.LoginRequest;
import com.eustache.users_service.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    @PostMapping("login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest loginRequest
            ) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));
            return new ResponseEntity<>("Logged in successfully: " + jwtUtil.generateToken(loginRequest.username()) , HttpStatus.OK);
        }catch (Exception e) {
            log.error(e.getMessage());
        }
        return new ResponseEntity<>("Failed to login", HttpStatus.UNAUTHORIZED);
    }
}
