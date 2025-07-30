package com.eustache.users_service.DTO;

import com.eustache.users_service.model.Role;
import jakarta.validation.constraints.NotBlank;

public record UserDTO(
        @NotBlank(message = "Username is required")
        String username,
        @NotBlank(message = "Email is required")
        String email,
        @NotBlank(message = "Password is required")
        String password,
        Role role
) {
}
