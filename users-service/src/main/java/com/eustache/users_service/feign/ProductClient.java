package com.eustache.users_service.feign;

import com.eustache.users_service.DTO.products.ProductDTO;
import com.eustache.users_service.DTO.products.ProductResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "PRODUCT-SERVICE-VIRUNGA")
public interface ProductClient {
    @GetMapping("/api/v1/products/allProducts")
     List<ProductResponseDTO> getAll();

    @PostMapping(value = "/api/v1/products/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
     String createProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestParam("imageFile") MultipartFile image
    );

    @GetMapping("/api/v1/products/type/{consumable}")
     List<ProductResponseDTO> getAllByTypeConsumable(
            @PathVariable String consumable
    );

    @GetMapping("/api/v1/products/type/{nonConsumable}")
     List<ProductResponseDTO> getProductByNoConsumable(
            @PathVariable String nonConsumable
    );

    @PatchMapping("/api/v1/products/update/{id}")
    String updateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductDTO  productDTO,
            @RequestParam("imageFile")  MultipartFile image
    );
    @GetMapping("/api/v1/getByName/{name}")
     List<ProductResponseDTO> getProductByName(
            @PathVariable String name
    );

    @GetMapping("/api/v1/products/getById/{id}")
     ProductResponseDTO getProductById(@PathVariable Integer id);

    @DeleteMapping("/api/v1/products/{id}")
     String deleteProductById(
            @PathVariable Integer id
    );
}
