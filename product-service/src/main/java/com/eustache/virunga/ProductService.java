package com.eustache.virunga;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
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
    ResponseEntity<List<ProductResponseDTO>> getProductByConsumable(String consumable);
    ResponseEntity<List<ProductResponseDTO>> getProductByNoConsumable(String noConsumable);
}
