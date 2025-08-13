package com.eustache.users_service.DTO.products;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ProductDTO(
        @NotBlank(message = "Name is required")
        String name,
        @NotBlank(message = "Quantity is required")
        Integer quantity,
        String description,
        Status status,
        Category category,
        TypeProduct typeProduct,
        LocalDate createdAt,
        LocalDate updatedAt
) {
}
