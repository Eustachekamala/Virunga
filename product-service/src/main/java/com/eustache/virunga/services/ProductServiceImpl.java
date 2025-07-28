package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.ProductDAO;
import com.eustache.virunga.ProductMapper;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.TypeProduct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import static com.eustache.virunga.utils.UpdateUtil.setNotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductMapper productMapper;
    private final ProductDAO productDAO;
    private final FileStorageService fileStorageService;

    @Override
    public ResponseEntity<String> createProduct(ProductDTO productDTO, MultipartFile imageFile) {
        try {
            String imagePath = fileStorageService.saveImage(imageFile);
            Product product = productMapper.toEntity(productDTO, imagePath);
            product.setImageFile(imagePath);
            productDAO.save(product);
            log.info("Product created: {}", product);
            return new ResponseEntity<>("Product created successfully", HttpStatus.CREATED);

        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return new ResponseEntity<>("Product creation failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateProduct(Integer id, ProductDTO productDTO, MultipartFile imageFile) {
        try {
            Product existingProduct = productDAO.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id));
            setNotNull(productDTO.name(), existingProduct::setName);
            setNotNull(productDTO.description(), existingProduct::setDescription);
            setNotNull(productDTO.category(), existingProduct::setCategory);
            setNotNull(productDTO.typeProduct(), existingProduct::setTypeProduct);
            setNotNull(productDTO.status(), existingProduct::setStatus);
            if (imageFile != null && !imageFile.isEmpty()) {
                //save the image to a path
                String newImageFile = fileStorageService.saveImage(imageFile);
                existingProduct.setImageFile(newImageFile);
            }
            productDAO.save(existingProduct);
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
        try{
            return new ResponseEntity<>(
                    productDAO.findProductByTypeProduct(TypeProduct.valueOf(consumable))
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
    public ResponseEntity<List<ProductResponseDTO>> getProductByNoConsumable(String noConsumable) {
        try{
            return new ResponseEntity<>(
                    productDAO.findProductByTypeProduct(TypeProduct.valueOf(noConsumable))
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
}
