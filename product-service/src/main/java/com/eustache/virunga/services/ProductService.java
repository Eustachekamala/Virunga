package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public interface ProductService {
    ResponseEntity<String> createProduct(ProductDTO productDTO, MultipartFile image);
    ResponseEntity<String> updateProduct(Integer id, ProductDTO productDTO, MultipartFile image);
    ResponseEntity<String> deleteProduct(Integer id);
    ResponseEntity<List<ProductResponseDTO>> getAllProducts();
    ResponseEntity<ProductResponseDTO> getProductById(Integer id);
    ResponseEntity<List<ProductResponseDTO>> getProductByName(String name);
    ResponseEntity<List<ProductResponseDTO>> getProductByConsumable(String consumable);
    ResponseEntity<List<ProductResponseDTO>> getProductByNoConsumable(String noConsumable);
    ResponseEntity<List<ProductResponseDTO>> getLowStockProducts();
}
