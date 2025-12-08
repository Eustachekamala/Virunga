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

    ResponseEntity<List<ProductResponseDTO>> getAllProducts();

    ResponseEntity<ProductResponseDTO> getProductById(Integer id);

    ResponseEntity<List<ProductResponseDTO>> getProductByName(String name);

    ResponseEntity<List<ProductResponseDTO>> getProductsByType(TypeProduct type);

    ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(Category category);

    ResponseEntity<List<ProductResponseDTO>> getLowStockProducts();

    ResponseEntity<String> stockIn(Integer id, Integer quantity);

    ResponseEntity<String> stockOut(Integer id, Integer quantity);
}
