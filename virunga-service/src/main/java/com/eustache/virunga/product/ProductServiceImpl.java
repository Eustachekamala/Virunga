package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductMapper productMapper;
    private final ProductDAO productDAO;

    @Override
    public ResponseEntity<String> createProduct(ProductDTO productDTO) {
        try {
            Product product = productMapper.toEntity(productDTO);
            product = productDAO.save(product);
            log.info("Product created: {}", product);
            return new ResponseEntity<>("Product created successfully", HttpStatus.OK);

        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("Product not created", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<String> updateProduct(Integer id, ProductDTO productDTO) {
        try {
            Product existingProduct = productDAO.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id));
            existingProduct.setName(productDTO.name());
            existingProduct.setQuantity(productDTO.quantity());
            existingProduct.setStatus(productDTO.status());
            existingProduct.setType(productDTO.typeProduct());
            existingProduct.setUpdatedAt(productDTO.updatedAt());
            existingProduct = productDAO.save(existingProduct);
            log.info("Product updated: {}", existingProduct);
            return new ResponseEntity<>("Product updated successfully", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("Product not updated", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<String> deleteProduct(Integer id) {
        try {
            productDAO.deleteById(id);
            log.info("Product deleted: {}", id);
            return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("Product not found with id " + id, HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        try {
            return new ResponseEntity<>(
                    productDAO.findAll()
                            .stream()
                            .map(productMapper::toDto)
                            .collect(Collectors.toList()),
                    HttpStatus.OK
            );
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ProductResponseDTO> getProductById(Integer id) {
        try {
            ProductResponseDTO productResponseDTO = productMapper.toDto(
                    productDAO.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id))
            );
            return new ResponseEntity<>(productResponseDTO, HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductByName(String name) {
        try {
            return new ResponseEntity<>(
                    productDAO.findByName(name)
                            .stream()
                            .map(productMapper::toDto)
                    .collect(Collectors.toList()),
                    HttpStatus.OK
            );
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductByConsumable(String consumable) {
        return null;
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductByNoConsumable(String noConsumable) {
        return null;
    }
}
