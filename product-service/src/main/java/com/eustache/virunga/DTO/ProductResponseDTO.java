package com.eustache.virunga.DTO;

import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;

import java.time.LocalDate;

public record ProductResponseDTO(
        Integer id,
        String name,
        int quantity,
        Status status,
        TypeProduct typeProduct,
        String description,
        LocalDate createdAt,
        LocalDate updatedAt,
        String imagePath
) {
}
