package com.eustache.users_service.DTO;

import com.eustache.users_service.model.Role;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Integer id,
        String email,
        String username,
        String firstName,
        String lastName,
        Role role,
        String profilePicture,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
