package com.eustache.users_service.DTO;

import com.eustache.users_service.model.Role;

public record UserResponseDTO(
        Integer id,
        String email,
        String username,
        Role role,
        String profilePicture
) {
}
