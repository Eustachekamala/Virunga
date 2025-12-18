package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.TypeProduct;


import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface ProductService {
    ResponseEntity<String> createProduct(ProductDTO productDTO);

    ResponseEntity<String> updateProduct(Integer id, ProductDTO productDTO);

    ResponseEntity<String> deleteProduct(Integer id);

    List<ProductResponseDTO> getAllProducts();

    ProductResponseDTO getProductById(Integer id);

    List<ProductResponseDTO> getProductByName(String name);

    List<ProductResponseDTO> getProductsByType(TypeProduct type);

    List<ProductResponseDTO> getProductsByCategory(Category category);

    List<ProductResponseDTO> getLowStockProducts();
}
