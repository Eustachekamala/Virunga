package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.Helper.CacheNames;
import com.eustache.virunga.ProductMapper;
import com.eustache.virunga.DAO.ProductDAO;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductDAO productDAO;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    private static final int DEFAULT_STOCK_ALERT_THRESHOLD = 5;

    @Override
    @CacheEvict(
        value = {
            CacheNames.PRODUCT_BY_ID,
            CacheNames.PRODUCT_LIST,
            CacheNames.PRODUCT_BY_CATEGORY,
            CacheNames.PRODUCT_BY_TYPE,
            CacheNames.PRODUCT_BY_NAME,
            CacheNames.LOW_STOCK
        },
        allEntries = true
    )
    public ResponseEntity<String> createProduct(ProductDTO productDTO) {
        try {
            String imagePath = null;
            if (productDTO.getImageFile() != null && !productDTO.getImageFile().isEmpty()) {
                imagePath = fileStorageService.saveImage(productDTO.getImageFile());
            }

            Product product = productMapper.toEntity(productDTO, imagePath);
            product.setImageFile(imagePath);
            if (product.getQuantity() == null)
                product.setQuantity(0);
            product.setStockAlertThreshold(DEFAULT_STOCK_ALERT_THRESHOLD);
            updateProductStatus(product);

            try {
                productDAO.save(product);
            } catch (DataIntegrityViolationException e) {
                log.error("Product already exists: {}", product.getName());
                return new ResponseEntity<>("Product already exists: " + product.getName(), HttpStatus.CONFLICT);
            }

            log.info("Product created: {}", product);
            return new ResponseEntity<>("Product created successfully", HttpStatus.CREATED);

        } catch (Exception ex) {
            log.error("Failed to create product: {}", ex.getMessage(), ex);
            return new ResponseEntity<>("Product creation failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @CacheEvict(
        value = {
            CacheNames.PRODUCT_BY_ID,
            CacheNames.PRODUCT_LIST,
            CacheNames.PRODUCT_BY_CATEGORY,
            CacheNames.PRODUCT_BY_TYPE,
            CacheNames.PRODUCT_BY_NAME,
            CacheNames.LOW_STOCK
        },
        allEntries = true
    )
    public ResponseEntity<String> updateProduct(Integer id, ProductDTO productDTO) {
        try {
            Product existingProduct = productDAO.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id));

            Optional.ofNullable(productDTO.getName()).ifPresent(existingProduct::setName);
            Optional.ofNullable(productDTO.getCategory()).ifPresent(existingProduct::setCategory);
            Optional.ofNullable(productDTO.getDescription()).ifPresent(existingProduct::setDescription);
            Optional.ofNullable(productDTO.getQuantity()).ifPresent(existingProduct::setQuantity);
            Optional.ofNullable(productDTO.getTypeProduct()).ifPresent(existingProduct::setTypeProduct);

            if (productDTO.getImageFile() != null && !productDTO.getImageFile().isEmpty()) {
                String newImageFile = fileStorageService.saveImage(productDTO.getImageFile());
                Optional.ofNullable(newImageFile).ifPresent(existingProduct::setImageFile);
            }

            updateProductStatus(existingProduct);
            productDAO.save(existingProduct);

            log.info("Product updated: {}", existingProduct);
            checkAndLogLowStock(existingProduct);

            return new ResponseEntity<>("Product updated successfully", HttpStatus.OK);

        } catch (IllegalArgumentException ex) {
            log.error("Product not found: {}", ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);

        } catch (DataIntegrityViolationException ex) {
            log.error("Data integrity violation during update: {}", ex.getMessage());
            return new ResponseEntity<>("Update failed: A field violates a unique constraint (e.g., duplicate name).",
                    HttpStatus.CONFLICT);

        } catch (Exception ex) {
            log.error("Unexpected failure to update product: {}", ex.getMessage(), ex);
            return new ResponseEntity<>("Update failed due to server processing error.", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @CacheEvict(
        value = {
            CacheNames.PRODUCT_BY_ID,
            CacheNames.PRODUCT_LIST,
            CacheNames.PRODUCT_BY_CATEGORY,
            CacheNames.PRODUCT_BY_TYPE,
            CacheNames.PRODUCT_BY_NAME,
            CacheNames.LOW_STOCK
        },
        allEntries = true
    )
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
    @Cacheable(cacheNames = CacheNames.PRODUCT_LIST)
    public List<ProductResponseDTO> getAllProducts() {
        log.debug("Fetching all products from database");
        return productDAO.findAll()
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(cacheNames = CacheNames.PRODUCT_BY_ID, key = "#id", unless = "#result == null")
    public ProductResponseDTO getProductById(Integer id) {
        log.debug("Fetching product by id: {}", id);
        return productMapper.toDto(
                productDAO.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id)));
    }

    @Override
    @Cacheable(cacheNames = CacheNames.PRODUCT_BY_NAME, key = "#name.toLowerCase()", unless = "#result.isEmpty()")
    public List<ProductResponseDTO> getProductByName(String name) {
        log.debug("Fetching products by name: {}", name);
        return productDAO.findByName(name)
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(cacheNames = CacheNames.PRODUCT_BY_TYPE, key = "#type.name()", unless = "#result.isEmpty()")
    public List<ProductResponseDTO> getProductsByType(TypeProduct type) {
        log.debug("Fetching products by type: {}", type);
        return productDAO.findByTypeProduct(type)
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(cacheNames = CacheNames.PRODUCT_BY_CATEGORY, key = "#category.name()", unless = "#result.isEmpty()")
    public List<ProductResponseDTO> getProductsByCategory(Category category) {
        log.debug("Fetching products by category: {}", category);
        return productDAO.findByCategory(category)
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(cacheNames = CacheNames.LOW_STOCK)
    public List<ProductResponseDTO> getLowStockProducts() {
        log.debug("Fetching low stock products from database");
        List<ProductResponseDTO> lowStockProducts = productDAO.findAll()
                .stream()
                .filter(p -> p.getQuantity() != null && p.getQuantity() <= DEFAULT_STOCK_ALERT_THRESHOLD)
                .map(productMapper::toDto)
                .collect(Collectors.toList());

        if (!lowStockProducts.isEmpty()) {
            log.warn("Low stock products found: {}", lowStockProducts.size());
        }

        return lowStockProducts;
    }

    private void checkAndLogLowStock(Product product) {
        if (product.getQuantity() != null && product.getQuantity() <= product.getStockAlertThreshold()) {
            log.warn("Product '{}' is low on stock! Current quantity: {}", product.getName(), product.getQuantity());

            String subject = "Low Stock Alert: " + product.getName();
            String message = String.format(
                    "Product: %s\nCurrent Quantity: %d\nThreshold: %d\n\nPlease restock immediately.",
                    product.getName(), product.getQuantity(), product.getStockAlertThreshold());

            emailService.sendEmail("eustachekamala.dev@gmail.com", subject, message);
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

    @Async
    @Scheduled(cron = "0 0 */12 * * *")
    @CacheEvict(
        value = {
            CacheNames.PRODUCT_BY_ID,
            CacheNames.PRODUCT_LIST,
            CacheNames.PRODUCT_BY_CATEGORY,
            CacheNames.PRODUCT_BY_TYPE,
            CacheNames.PRODUCT_BY_NAME,
            CacheNames.LOW_STOCK
        },
        allEntries = true
    )
    public void scheduledLowStockCheck() {
        log.info("Running scheduled low stock check...");

        var lowStockProducts = productDAO.findAll().stream()
                .peek(this::updateProductStatus)
                .map(productDAO::save)
                .filter(p -> p.getQuantity() != null && p.getStockAlertThreshold() != null
                        && p.getQuantity() <= p.getStockAlertThreshold())
                .collect(Collectors.toList());

        if (!lowStockProducts.isEmpty()) {
            StringBuilder message = new StringBuilder(
                    "Low Stock Alert!\n\nThe following products are below their stock threshold:\n\n");

            lowStockProducts.forEach(p -> message.append(String.format(
                    "• %s — Qty: %d (Threshold: %d)\n",
                    p.getName(),
                    p.getQuantity(),
                    p.getStockAlertThreshold())));

            message.append("\nPlease restock these items as soon as possible.");

            emailService.sendEmail(
                    "eustachekamala.dev@gmail.com",
                    "Stock Alert: Low Inventory Detected",
                    message.toString());

            log.warn("Low stock alert email sent. Products affected: {}", lowStockProducts.size());
        }

        log.info("Low stock check completed.");
    }
}