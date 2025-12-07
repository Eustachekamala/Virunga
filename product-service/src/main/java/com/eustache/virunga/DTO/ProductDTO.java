package com.eustache.virunga.DTO;

import org.springframework.web.multipart.MultipartFile;

import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.TypeProduct;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductDTO(
        @NotBlank(message = "Name is required")
        String name,
        @NotNull(message = "Quantity is required")
        Integer quantity,
        String description,
        Category category,
        TypeProduct typeProduct,
        MultipartFile imageFile
) {
}
