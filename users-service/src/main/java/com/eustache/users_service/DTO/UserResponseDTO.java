package com.eustache.users_service.DTO;

public record UserResponseDTO(
        Integer id,
        String email,
        String username,
        String profilePicture
) {
}
