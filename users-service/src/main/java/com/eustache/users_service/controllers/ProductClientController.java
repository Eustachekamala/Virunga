package com.eustache.users_service.controllers;

import com.eustache.users_service.DTO.products.ProductDTO;
import com.eustache.users_service.DTO.products.ProductResponseDTO;
import com.eustache.users_service.feign.ProductClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/admin/products")
@CrossOrigin(origins = "*", maxAge = 3600)
// Controller for ADMIN product management via FeignClient to PRODUCT-SERVICE-VIRUNGA
public class ProductClientController {

    private final ProductClient productClientService;

    // Get all products
    @GetMapping("/all")
    public List<ProductResponseDTO> getAllProducts() {
        return productClientService.getAll();
    }

    // Create product
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String createProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestParam("imageFile") MultipartFile image
    ) {
        return productClientService.createProduct(productDTO, image);
    }

    // Get products by consumable type
    @GetMapping("/type/consumable/{consumable}")
    public List<ProductResponseDTO> getConsumableProducts(
            @PathVariable String consumable
    ) {
        return productClientService.getAllByTypeConsumable(consumable);
    }

    // Get products by non-consumable type
    @GetMapping("/type/non-consumable/{nonConsumable}")
    public List<ProductResponseDTO> getNonConsumableProducts(
            @PathVariable String nonConsumable
    ) {
        return productClientService.getProductByNoConsumable(nonConsumable);
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ProductResponseDTO getProductById(
            @PathVariable Integer id
    ) {
        return productClientService.getProductById(id);
    }

    // Get product by name
    @GetMapping("/name/{name}")
    public List<ProductResponseDTO> getProductByName(
            @PathVariable String name
    ) {
        return productClientService.getProductByName(name);
    }

    // Update product
    @PatchMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String updateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductDTO productDTO,
            @RequestParam("imageFile") MultipartFile image
    ) {
        return productClientService.updateProduct(id, productDTO, image);
    }

    // Delete product
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteProduct(
            @PathVariable Integer id
    ) {
        return productClientService.deleteProductById(id);
    }
}
