package com.eustache.virunga.controller;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.TypeProduct;
import com.eustache.virunga.services.ProductServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Controller", description = "Controller for managing products")
public class ProductController {
    private final ProductServiceImpl productService;

    @Operation(summary = "Get all products")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "No product found")
    })
    @GetMapping("/allProducts")
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return productService.getAllProducts();
    }

    @Operation(summary = "Insert a new product")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(
            @ModelAttribute ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @Operation(summary = "Get Products by type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid type supplied")
    })
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByType(
            @PathVariable String type) {
        TypeProduct typeEnum;
        try {
            typeEnum = TypeProduct.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }
        return productService.getProductsByType(typeEnum);
    }

    @Operation(summary = "Get Products by category")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid category supplied")
    })
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(
            @PathVariable String category) {
        Category categoryEnum;
        try {
            categoryEnum = Category.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }
        return productService.getProductsByCategory(categoryEnum);
    }

    @Operation(summary = "Get Products with low stocks")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Products with no found")
    })
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponseDTO>> getLowProductStocks() {
        return productService.getLowStockProducts();
    }

    @Operation(summary = "Update a product")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    @PatchMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductDTO productDTO) {
        return productService.updateProduct(id, productDTO);
    }

    @Operation(summary = "Filter product by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Non product was found")
    })
    @GetMapping("/getByName/{name}")
    public ResponseEntity<List<ProductResponseDTO>> getProductByName(
            @PathVariable String name) {
        return productService.getProductByName(name);
    }

    @Operation(summary = "Get product by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Non product was found")
    })
    @GetMapping("/getById/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @Operation(summary = "Delete a product")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product was deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Non product was found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductById(
            @PathVariable Integer id) {
        return productService.deleteProduct(id);
    }
}
