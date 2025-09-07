package com.eustache.virunga.services;

import com.eustache.virunga.ProductDAO;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ProductInitializer {
    private static final int DEFAULT_STOCK_ALERT_THRESHOLD = 5;
    @Bean
    public CommandLineRunner commandLineRunner(ProductDAO productDAO) {
        return args -> {
            Product product = new Product();
            if (productDAO.findByName("name").isEmpty()) {
                product.setName("Screw Driver");
                product.setDescription("description");
                product.setCategory(Category.ELECTRICITY);
                product.setTypeProduct(TypeProduct.NON_CONSUMABLE);
                product.setQuantity(30);
                product.setStockAlertThreshold(DEFAULT_STOCK_ALERT_THRESHOLD);
                product.setStatus(Status.NON_URGENT);
                productDAO.save(product);
                System.out.println("Default product '" + product.getName() + "' has been created with quantity " + product.getQuantity());
            }
        };
    }
}
