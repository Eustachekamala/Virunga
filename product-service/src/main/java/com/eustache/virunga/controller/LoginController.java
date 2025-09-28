package com.eustache.virunga.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

//@RestController
//@RequestMapping("/auth")
//@RequiredArgsConstructor
public class LoginController {

    @Value("${spring.security.oauth2.client.provider.keycloak.token-uri}")
    private String keycloakTokenUri;

    @Value("${spring.security.oauth2.client.registration.keycloak.client-id}")
    private String clientId;

    /**
     * PKCE flow:
     * - Handled directly by frontend via react-oauth2-code-pkce
     * - Redirects user to Keycloak login page
     * - No backend endpoint needed here
     */

    /**
     * Password grant flow (parallel support).
     * For service-to-service login or legacy clients.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "client_id=" + clientId +
                "&grant_type=password" +
                "&username=" + username +
                "&password=" + password;

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    keycloakTokenUri, request, Map.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    /**
     * Optional: Refresh token endpoint (parallel to PKCE).
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refresh_token");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String payload = "client_id=" + clientId+
                "&grant_type=refresh_token" +
                "&refresh_token=" + refreshToken;

        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    keycloakTokenUri, request, Map.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}
