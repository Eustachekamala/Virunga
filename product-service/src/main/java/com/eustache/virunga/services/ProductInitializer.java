package com.eustache.virunga.services;

import com.eustache.virunga.DAO.ProductDAO;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Component
public class ProductInitializer {
    private static final int DEFAULT_STOCK_ALERT_THRESHOLD = 5;

    @Bean
    public CommandLineRunner commandLineRunner(ProductDAO productDAO) {
        return args -> {
            String defaultProductName = "Screw Driver";

            // Check if it already exists
            if (productDAO.findByName(defaultProductName).isEmpty()) {
                Product product = new Product();
                product.setName(defaultProductName);
                product.setDescription("This tool is used to drive screws into various materials.");
                product.setCategory(Category.ELECTRICITY);
                product.setTypeProduct(TypeProduct.NON_CONSUMABLE);
                product.setQuantity(4);
                product.setStockAlertThreshold(DEFAULT_STOCK_ALERT_THRESHOLD);
                product.setStatus(Status.NON_URGENT);
                try {
                    productDAO.save(product);
                } catch (DataIntegrityViolationException e) {
                    System.out.println("Product already exists: " + product.getName());
                }

                System.out.println("✅ Default product '" + product.getName() + "' created.");
            } else {
                System.out.println("ℹ️ Product '" + defaultProductName + "' already exists. Skipping initialization.");
            }
        };
    }
}

