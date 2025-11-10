package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.DTO.ProductResponseDTO;
import com.eustache.virunga.ProductMapper;
import com.eustache.virunga.DAO.ProductDAO;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    /**
     * Creates a new product in the system.
     * 
     * @param productDTO The product data transfer object containing the product information
     * @return ResponseEntity containing a success message and HTTP status CREATED if successful,
     *         or an error message and HTTP status INTERNAL_SERVER_ERROR if creation fails
     */
    @Override
    public ResponseEntity<String> createProduct(ProductDTO productDTO) {
        try {
            String imagePath = null;
            if (productDTO.imagFile() != null && !productDTO.imagFile().isEmpty()) {
                imagePath = fileStorageService.saveImage(productDTO.imagFile());
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

    /**
     * Updates an existing product in the system.
     * 
     * @param id The ID of the product to update
     * @param productDTO The product data transfer object containing the updated product information
     * @return ResponseEntity containing a success message and HTTP status OK if successful,
     *         or an error message and HTTP status BAD_REQUEST if update fails
     */
    @Override
    public ResponseEntity<String> updateProduct(Integer id, ProductDTO productDTO) {
        try {
            Product existingProduct = productDAO.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id));

            Optional.ofNullable(productDTO.name()).ifPresent(existingProduct::setName);
            Optional.ofNullable(productDTO.category()).ifPresent(existingProduct::setCategory);
            Optional.ofNullable(productDTO.description()).ifPresent(existingProduct::setDescription);
            Optional.ofNullable(productDTO.quantity()).ifPresent(existingProduct::setQuantity);
            Optional.ofNullable(productDTO.typeProduct()).ifPresent(existingProduct::setTypeProduct);


            if (productDTO.imagFile() != null && !productDTO.imagFile().isEmpty()) {
                String newImageFile = fileStorageService.saveImage(productDTO.imagFile());
                Optional.ofNullable(newImageFile).ifPresent(existingProduct::setImageFile);
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

    /**
     * Deletes a product from the system.
     * 
     * @param id The ID of the product to delete
     * @return ResponseEntity containing a success message and HTTP status OK if successful,
     *         or an error message and HTTP status NOT_FOUND if the product doesn't exist
     */
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

    /**
     * Retrieves all products from the system.
     * 
     * @return ResponseEntity containing a list of ProductResponseDTO and HTTP status OK,
     *         returns an empty list if no products are found
     */
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

    /**
     * Retrieves a product by its ID.
     * 
     * @param id The ID of the product to retrieve
     * @return ResponseEntity containing the ProductResponseDTO and HTTP status OK if found,
     *         or HTTP status NOT_FOUND if the product doesn't exist
     */
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

    /**
     * Retrieves products by their name.
     * 
     * @param name The name of the products to search for
     * @return ResponseEntity containing a list of matching ProductResponseDTO and HTTP status OK,
     *         returns an empty list if no products are found
     */
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

    /**
     * Retrieves products by their type.
     * 
     * @param type The type of products to retrieve
     * @return ResponseEntity containing a list of matching ProductResponseDTO and HTTP status OK,
     *         or an empty list and HTTP status INTERNAL_SERVER_ERROR if the operation fails
     */
    @Override
    public ResponseEntity<List<ProductResponseDTO>> getProductsByType(TypeProduct type) {
        try {
            List<ProductResponseDTO> products = productDAO.findByTypeProduct(type)
                    .stream()
                    .map(productMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("Failed to fetch products by type {}: {}", type, ex.getMessage(), ex);
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Retrieves all products that are low on stock (quantity <= stock alert threshold).
     * 
     * @return ResponseEntity containing a list of low stock ProductResponseDTO and HTTP status OK,
     *         returns an empty list if no low stock products are found
     */
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
    /**
     * Helper method to check and log if a product is low on stock.
     * 
     * @param product The product to check for low stock
     */
    private void checkAndLogLowStock(Product product) {
        if (product.getQuantity() != null && product.getQuantity() <= product.getStockAlertThreshold()) {
            log.warn("Product '{}' is low on stock! Current quantity: {}", product.getName(), product.getQuantity());
        }
    }

    /**
     * Updates the status of a product based on its current quantity and stock alert threshold.
     * Sets status to URGENT if quantity is below or equal to threshold, NON_URGENT otherwise.
     * 
     * @param product The product to update the status for
     */
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


    /**
     * Scheduled task that runs every 12 hours to check and update the status of all products
     * based on their current stock levels. This method runs asynchronously.
     */
    @Async
    @Scheduled(cron = "0 0 */12 * * *") // every 12 hours
    // @Scheduled(cron = "0 * * * * *") // every 1 minute
    public void scheduledLowStockCheck() {
        log.info("Running scheduled low stock check...");

        var lowStockProducts = productDAO.findAll().stream()
                .peek(this::updateProductStatus) // update each product's status
                .map(productDAO::save)           // save updated status
                .filter(p -> p.getQuantity() <= p.getStockAlertThreshold())
                .toList();

        // If there are low-stock products, send an email alert
        if (!lowStockProducts.isEmpty()) {
            StringBuilder message = new StringBuilder("⚠️ Low Stock Alert!\n\nThe following products are below their stock threshold:\n\n");

            lowStockProducts.forEach(p -> message.append(String.format(
                    "• %s — Qty: %d (Threshold: %d)\n",
                    p.getName(),
                    p.getQuantity(),
                    p.getStockAlertThreshold()
            )));

            message.append("\nPlease restock these items as soon as possible.");

            emailService.sendEmail(
                    "eustachekamala.dev@gmail.com",
                    "Stock Alert: Low Inventory Detected",
                    message.toString()
            );

            log.warn("Low stock alert email sent to admin. Products: {}", lowStockProducts.size());
        }

        log.info("Low stock check completed.");
    }


}
