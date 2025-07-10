package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Status;
import com.eustache.virunga.product.model.Type;

import java.util.Date;

public record ProductResponseDTO(
        Integer id,
        String name,
        int quantity,
        Status status,
        Type type,
        String description,
        Date createdAt,
        Date updatedAt,
        String image
) {
}
