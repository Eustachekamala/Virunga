package com.eustache.virunga;

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
        TypeProduct typeProduct,
        LocalDate createdAt,
        LocalDate updatedAt
) {
}
