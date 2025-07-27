package com.eustache.virunga;

import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.Type;

import java.util.Date;

public record ProductDTO(
        String name,
        int quantity,
        Status status,
        Type typeProduct,
        Date createdAt,
        Date updatedAt
) {
}
