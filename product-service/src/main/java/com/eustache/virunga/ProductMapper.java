package com.eustache.virunga;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.model.Product;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ProductMapper {
    private static final int DEFAULT_STOCK_ALERT_THRESHOLD = 5;
    public ProductResponseDTO toDto(Product product) {
        if (product == null) return null;

        boolean lowStock = product.getQuantity() != null
                && product.getStockAlertThreshold() != null
                && product.getQuantity() <= product.getStockAlertThreshold();

        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getStatus(),
                product.getTypeProduct(),
                product.getStockAlertThreshold(),
                product.getDescription(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getImageFile(),
                lowStock
        );
    }

    public Product toEntity(ProductDTO productDTO,  String image) {
        if (productDTO == null) return null;
        Product product = new Product();
        product.setName(productDTO.name());
        // Set quantity; default to 0 if null
        product.setQuantity(productDTO.quantity() != null ? productDTO.quantity() : 0);

        // Set stock alert threshold; default if not provided
        product.setStockAlertThreshold(
                productDTO.stockAlertThreshold() != null
                        ? productDTO.stockAlertThreshold()
                        : DEFAULT_STOCK_ALERT_THRESHOLD
        );
        product.setStockAlertThreshold(productDTO.quantity());
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
