package com.eustache.virunga.DTO;

import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ProductDTO(
        @NotBlank(message = "Name is required")
        String name,
        @NotNull(message = "Quantity is required")
        Integer quantity,
        String description,
        Status status,
        Category category,
        TypeProduct typeProduct,
        LocalDate createdAt,
        LocalDate updatedAt
) {
}
