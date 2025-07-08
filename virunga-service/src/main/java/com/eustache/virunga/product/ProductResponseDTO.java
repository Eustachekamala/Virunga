package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Status;
import com.eustache.virunga.product.model.Type_Product;

import java.util.Date;

public record ProductResponseDTO(
        Integer id,
        String name,
        int quantity,
        Status status,
        Type_Product typeProduct,
        String description,
        Date createdAt,
        Date updatedAt,
        String image
) {
}
