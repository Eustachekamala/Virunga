package com.eustache.users_service.controllers;

import com.eustache.users_service.DTO.products.ProductDTO;
import com.eustache.users_service.DTO.products.ProductResponseDTO;
import com.eustache.users_service.feign.ProductClient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
@CrossOrigin(origins = "*", maxAge = 3600)
// This controller is for user-related product operations, typically for admin users.
// It allows admins to manage products, including creating, updating, deleting, and retrieving products.
// The methods are secured with the 'ADMIN' authority, ensuring that only users with the appropriate
// permissions can access these endpoints.
// The controller interacts with the ProductClient service to perform these operations.
// The endpoints are designed to handle multipart file uploads for product images.
public class ProductClientController {
    private final ProductClient productClientService;

    //Product methods
    @GetMapping("get/allProducts")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ProductResponseDTO> userGetProducts() {
        return productClientService.getAll();
    }

    @PostMapping("insert/products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String userCreateProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestParam("imageFile") MultipartFile image
    ) {
        return productClientService.createProduct(productDTO, image);
    }

    @GetMapping("products/type/{consumable}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ProductResponseDTO> userGetConsumableProducts(
            @PathVariable String consumable
    ) {
        return productClientService.getAllByTypeConsumable(consumable);
    }

    @GetMapping("products/type/{noConsumable}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ProductResponseDTO> userGetNoConsumableProducts(
            @PathVariable String noConsumable
    ) {
        return productClientService.getProductByNoConsumable(noConsumable);
    }

    @PatchMapping("products/update/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String userUpdateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductDTO  productDTO,
            @RequestParam("imageFile")  MultipartFile image
    ){
        return productClientService.updateProduct(id, productDTO, image);
    }

    @DeleteMapping("products/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String userDeleteProduct(
            @PathVariable Integer id
    ){
        return productClientService.deleteProductById(id);
    }
}
