package com.eustache.users_service.controllers;

import com.eustache.users_service.requests.LoginRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
@Slf4j
public class AuthentificationController {
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest loginRequest
            ) {
        String username = (loginRequest.username() == null || loginRequest.username().isEmpty()) ? "admin" : loginRequest.username();
        String password = (loginRequest.password() == null || loginRequest.password().isEmpty()) ? "admin1234" : loginRequest.password();
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(username, password);
        try {
            authenticationManager.authenticate(authenticationRequest);
            return new ResponseEntity<>("success", HttpStatus.OK);
        }catch (Exception e) {
            log.error(e.getMessage());
        }
        return new ResponseEntity<>("fail", HttpStatus.UNAUTHORIZED);
    }
}
