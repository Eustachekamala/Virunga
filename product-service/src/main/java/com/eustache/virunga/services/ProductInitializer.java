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
            // Only initialize if database is empty
            if (productDAO.count() == 0) {
                System.out.println("🔧 Database is empty. Initializing with sample products...");
                initializeSampleProducts(productDAO);
                System.out.println("✅ Sample products initialized successfully!");
            } else {
                System.out.println(
                        "ℹ️ Database already contains " + productDAO.count() + " products. Skipping initialization.");
            }
        };
    }

    private void initializeSampleProducts(ProductDAO productDAO) {
        // Product 1: Screwdriver
        createProduct(productDAO,
                "Screwdriver Set",
                "Professional screwdriver set with multiple heads for various applications",
                Category.ELECTRONICS,
                TypeProduct.NON_CONSUMABLE,
                15,
                DEFAULT_STOCK_ALERT_THRESHOLD,
                Status.NON_URGENT);

        // Product 2: Electrical Wire (LOW STOCK)
        createProduct(productDAO,
                "Electrical Wire 2.5mm",
                "High-quality copper electrical wire, 2.5mm diameter, 100m roll",
                Category.ELECTRICITY,
                TypeProduct.CONSUMABLE,
                3,
                10, // Custom threshold for this product
                Status.URGENT);

        // Product 3: Pipe Wrench
        createProduct(productDAO,
                "Pipe Wrench 12 inch",
                "Heavy-duty pipe wrench for plumbing and maintenance work",
                Category.PLUMBING,
                TypeProduct.NON_CONSUMABLE,
                8,
                3, // Custom threshold for this product
                Status.NON_URGENT);

        // Product 4: PVC Pipes
        createProduct(productDAO,
                "PVC Pipe 1 inch",
                "Standard PVC pipes, 1 inch diameter, 3 meter length",
                Category.PLUMBING,
                TypeProduct.CONSUMABLE,
                25,
                15, // Custom threshold for this product
                Status.NON_URGENT);

        // Product 5: Circuit Breakers (LOW STOCK)
        createProduct(productDAO,
                "Circuit Breaker 20A",
                "20 Ampere circuit breakers for electrical panel installations",
                Category.ELECTRICITY,
                TypeProduct.CONSUMABLE,
                4,
                DEFAULT_STOCK_ALERT_THRESHOLD,
                Status.URGENT);

        System.out.println("📦 Created 5 sample products:");
        System.out.println("   1. Screwdriver Set (ELECTRONICS, NON_CONSUMABLE) - Qty: 15");
        System.out.println("   2. Electrical Wire 2.5mm (ELECTRICITY, CONSUMABLE) - Qty: 3 ⚠️ LOW STOCK");
        System.out.println("   3. Pipe Wrench 12 inch (PLUMBING, NON_CONSUMABLE) - Qty: 8");
        System.out.println("   4. PVC Pipe 1 inch (PLUMBING, CONSUMABLE) - Qty: 25");
        System.out.println("   5. Circuit Breaker 20A (ELECTRICITY, CONSUMABLE) - Qty: 4 ⚠️ LOW STOCK");
    }

    private void createProduct(ProductDAO productDAO, String name, String description,
            Category category, TypeProduct typeProduct,
            int quantity, int threshold, Status status) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setTypeProduct(typeProduct);
        product.setQuantity(quantity);
        product.setStockAlertThreshold(threshold);
        product.setStatus(status);

        try {
            productDAO.save(product);
            System.out.println("   ✓ Created: " + name);
        } catch (DataIntegrityViolationException e) {
            System.out.println("   ⚠️ Already exists: " + name);
        }
    }
}
