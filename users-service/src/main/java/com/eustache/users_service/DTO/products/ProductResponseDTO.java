package com.eustache.users_service.DTO.products;


import java.time.LocalDate;

public record ProductResponseDTO(
        Integer id,
        String name,
        Integer quantity,
        Status status,
        TypeProduct typeProduct,
        String description,
        LocalDate createdAt,
        LocalDate updatedAt,
        String imageFile
) {
}
