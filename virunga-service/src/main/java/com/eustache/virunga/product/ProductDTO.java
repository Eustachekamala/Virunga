package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Status;
import com.eustache.virunga.product.model.Type_Product;

import java.util.Date;

public record ProductDTO(
        String name,
        int quantity,
        Status status,
        Type_Product typeProduct,
        Date createdAt,
        Date updatedAt
) {
}
