package com.eustache.virunga;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.model.Product;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ProductMapper {
    private static final int DEFAULT_STOCK_ALERT_THRESHOLD = 5;

    public ProductResponseDTO toDto(Product product) {
        if (product == null)
            return null;

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
                lowStock,
                product.getCategory());
    }

    public Product toEntity(ProductDTO productDTO, String image) {
        if (productDTO == null) {
            // Toujours retourner un objet, jamais null → évite les NPE
            Product emptyProduct = new Product();
            emptyProduct.setQuantity(0);
            emptyProduct.setStockAlertThreshold(DEFAULT_STOCK_ALERT_THRESHOLD);
            emptyProduct.setCreatedAt(LocalDate.now());
            emptyProduct.setUpdatedAt(LocalDate.now());
            emptyProduct.setImageFile(image);
            return emptyProduct;
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setQuantity(productDTO.getQuantity() != null ? productDTO.getQuantity() : 0);
        product.setStockAlertThreshold(
                productDTO.getQuantity() != null ? productDTO.getQuantity() : DEFAULT_STOCK_ALERT_THRESHOLD);
        product.setCategory(productDTO.getCategory());
        product.setImageFile(image);
        product.setDescription(productDTO.getDescription());
        product.setTypeProduct(productDTO.getTypeProduct());
        product.setCreatedAt(LocalDate.now());
        product.setUpdatedAt(LocalDate.now());
        return product;
    }
}
