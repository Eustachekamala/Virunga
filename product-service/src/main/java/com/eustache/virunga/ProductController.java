package com.eustache.virunga;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.services.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestParam("imageFile") MultipartFile image
    ){
        return productService.createProduct(productDTO, image);
    }

    @GetMapping("type/{consumable}")
    public ResponseEntity<List<ProductResponseDTO>> getAllByTypeConsumable(
            @PathVariable String consumable
    ) {
        return productService.getProductByConsumable(consumable);
    }

    @GetMapping("type/{nonConsumable}")
    public ResponseEntity<List<ProductResponseDTO>> getProductByNoConsumable(
            @PathVariable String nonConsumable
    ){
        return productService.getProductByNoConsumable(nonConsumable);
    }

    @PatchMapping("update/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductDTO  productDTO,
            @RequestParam("imageFile")  MultipartFile image
    ){
        return productService.updateProduct(id, productDTO, image);
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

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProductById(
            @PathVariable Integer id
    ){
        return productService.deleteProduct(id);
    }
}
