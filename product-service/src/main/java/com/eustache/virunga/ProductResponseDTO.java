package com.eustache.virunga;

import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.Type;

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
