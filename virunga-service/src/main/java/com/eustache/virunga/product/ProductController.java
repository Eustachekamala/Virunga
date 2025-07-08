package com.eustache.virunga.product;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductServiceImpl  productService;

    @GetMapping("allProducts")
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return productService.getAllProducts();
    }
}
