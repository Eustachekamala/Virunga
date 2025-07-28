package com.eustache.virunga;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductServiceImpl productService;

    @GetMapping("allProducts")
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return productService.getAllProducts();
    }

    @PostMapping("insert")
    public ResponseEntity<String> createProduct(
            @RequestBody ProductDTO productDTO
    ){
        return productService.createProduct(productDTO);
    }

    @GetMapping("type/{consumable}")
    public ResponseEntity<List<ProductResponseDTO>> getAllByTypeConsumable(
            @PathVariable String consumable
    ) {
        return productService.getProductByConsumable(consumable);
    }

    @GetMapping("type/{nonConsumable}")
    public ResponseEntity<List<ProductResponseDTO>> getAllByTypeConConsumable(
            @PathVariable String nonConsumable
    ){
        return productService.getProductByConsumable(nonConsumable);
    }

    @PatchMapping("update/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable Integer id,
            @RequestBody ProductDTO  productDTO
    ){
        return productService.updateProduct(id, productDTO);
    }

    @GetMapping("get/{name}")
    public ResponseEntity<List<ProductResponseDTO>> getProductByName(
            @PathVariable String name
    ){
        return productService.getProductByName(name);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Integer id
    ){
        return productService.getProductById(id);
    }
}
