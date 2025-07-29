package com.eustache.users_service.DTO;

import com.eustache.users_service.model.RoleUser;

public record UserResponseDTO(
        Integer id,
        String email,
        String username,
        RoleUser roleUser,
        String profilePicture
) {
}
