package com.eustache.virunga;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.model.Product;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ProductMapper {
    public ProductResponseDTO toDto(Product product) {
        if (product == null) return null;
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getStatus(),
                product.getTypeProduct(),
                product.getDescription(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getImageFile()
        );
    }

    public Product toEntity(ProductDTO productDTO,  String image) {
        if (productDTO == null) return null;
        Product product = new Product();
        product.setName(productDTO.name());
        product.setQuantity(productDTO.quantity());
        product.setStatus(productDTO.status());
        product.setCategory(productDTO.category());
        product.setImageFile(image);
        product.setDescription(productDTO.description());
        product.setTypeProduct(productDTO.typeProduct());
        product.setCreatedAt(productDTO.createdAt());
        product.setUpdatedAt(productDTO.updatedAt());
        return product;
    }
}
