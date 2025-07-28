package com.eustache.virunga.DTO;

import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ProductDTO(
        @NotBlank(message = "Name is required")
        String name,
        @NotBlank(message = "Quantity is required")
        int quantity,
        Status status,
        Category category,
        TypeProduct typeProduct,
        String imagePath,
        LocalDate createdAt,
        LocalDate updatedAt
) {
}
