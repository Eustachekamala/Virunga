package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    public ProductResponseDTO toDto(Product product) {
        if (product == null) return null;
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getStatus(),
                product.getType(),
                product.getDescription(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getImage()
        );
    }

    public Product toEntity(ProductDTO productDTO) {
        if (productDTO == null) return null;
        Product product = new Product();
        product.setName(productDTO.name());
        product.setQuantity(productDTO.quantity());
        product.setStatus(productDTO.status());
        product.setType(productDTO.typeProduct());
        product.setCreatedAt(productDTO.createdAt());
        product.setUpdatedAt(productDTO.updatedAt());
        return product;
    }
}
