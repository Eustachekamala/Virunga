package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.ProductDAO;
import com.eustache.virunga.ProductMapper;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.eustache.virunga.utils.UpdateUtil.setNotNull;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductDAO productDAO;
    private final FileStorageService fileStorageService;

    private static final int DEFAULT_STOCK_ALERT_THRESHOLD = 5;

    @Override
    public ResponseEntity<String> createProduct(ProductDTO productDTO, MultipartFile imageFile) {
        try {
            String imagePath = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                imagePath = fileStorageService.saveImage(imageFile);
            }

            Product product = productMapper.toEntity(productDTO, imagePath);
            product.setImageFile(imagePath);
            if (product.getQuantity() == null) product.setQuantity(0);
            product.setStockAlertThreshold(DEFAULT_STOCK_ALERT_THRESHOLD);
            //To update the status
            updateProductStatus(product);
            productDAO.save(product);
            log.info("Product created: {}", product);
            return new ResponseEntity<>("Product created successfully", HttpStatus.CREATED);

        } catch (Exception ex) {
            log.error("Failed to create product: {}", ex.getMessage(), ex);
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
            setNotNull(productDTO.quantity(), existingProduct::setQuantity);

            if (imageFile != null && !imageFile.isEmpty()) {
                String newImageFile = fileStorageService.saveImage(imageFile);
                existingProduct.setImageFile(newImageFile);
            }

            //To update the status
            updateProductStatus(existingProduct);
            productDAO.save(existingProduct);
            log.info("Product updated: {}", existingProduct);

            // Check stock alert
            checkAndLogLowStock(existingProduct);

            return new ResponseEntity<>("Product updated successfully", HttpStatus.OK);

        } catch (Exception ex) {
            log.error("Failed to update product: {}", ex.getMessage(), ex);
            return new ResponseEntity<>("Product not updated", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> deleteProduct(Integer id) {
        try {
            if (!productDAO.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with id " + id);
            }
            productDAO.deleteById(id);
            log.info("Product deleted: {}", id);
            return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to delete product: {}", ex.getMessage(), ex);
            return new ResponseEntity<>("Product not found with id " + id, HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        try {
            List<ProductResponseDTO> products = productDAO.findAll()
                    .stream()
                    .map(productMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to fetch products: {}", ex.getMessage(), ex);
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<ProductResponseDTO> getProductById(Integer id) {
        try {
            ProductResponseDTO productResponseDTO = productMapper.toDto(
                    productDAO.findById(id)
                            .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id))
            );
            return new ResponseEntity<>(productResponseDTO, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to fetch product: {}", ex.getMessage(), ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductByName(String name) {
        try {
            List<ProductResponseDTO> products = productDAO.findByName(name)
                    .stream()
                    .map(productMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to fetch products by name: {}", ex.getMessage(), ex);
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductByConsumable(String consumable) {
        return getListResponseEntity(consumable);
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductByNoConsumable(String noConsumable) {
        return getListResponseEntity(noConsumable);
    }

    private ResponseEntity<List<ProductResponseDTO>> getListResponseEntity(String type) {
        try {
            List<ProductResponseDTO> products = productDAO.findProductByTypeProduct(TypeProduct.valueOf(type))
                    .stream()
                    .map(productMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to fetch products by type: {}", ex.getMessage(), ex);
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getLowStockProducts() {
        try {
            List<ProductResponseDTO> lowStockProducts = productDAO.findAll()
                    .stream()
                    .filter(p -> p.getQuantity() != null && p.getQuantity() <= p.getStockAlertThreshold())
                    .map(productMapper::toDto)
                    .collect(Collectors.toList());

            if (!lowStockProducts.isEmpty()) {
                log.warn("Low stock products: {}", lowStockProducts);
            }

            return new ResponseEntity<>(lowStockProducts, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to fetch low stock products: {}", ex.getMessage(), ex);
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    // Helper method to log low stock for a single product
    private void checkAndLogLowStock(Product product) {
        if (product.getQuantity() != null && product.getQuantity() <= product.getStockAlertThreshold()) {
            log.warn("Product '{}' is low on stock! Current quantity: {}", product.getName(), product.getQuantity());
        }
    }

    private void updateProductStatus(Product product) {
        if (product.getQuantity() != null && product.getStockAlertThreshold() != null) {
            if (product.getQuantity() <= product.getStockAlertThreshold()) {
                product.setStatus(Status.URGENT);
                log.warn("Product '{}' is low on stock! Status set to URGENT. Quantity: {}",
                        product.getName(), product.getQuantity());
            } else {
                product.setStatus(Status.NON_URGENT);
            }
        }
    }


    @Scheduled(fixedRate = 60000) // every 1 minute
    public void scheduledLowStockCheck() {
        productDAO.findAll().forEach(product -> {
            updateProductStatus(product);
            productDAO.save(product);
        });
    }

}
