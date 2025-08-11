package com.eustache.virunga.services;

import com.eustache.virunga.ProductDAO;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.TypeProduct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ProductInitializer {
    @Bean
    public CommandLineRunner initProduct(ProductDAO productDAO) {
        return args -> {
            Product product = new Product();
            if (productDAO.findByName("name").isPresent()) {
                product.setName("Screw Driver");
                product.setDescription("description");
                product.setCategory(Category.ELECTRICITY);
                product.setTypeProduct(TypeProduct.NON_CONSUMABLE);
                product.setQuantity(1);
                productDAO.save(product);
            }
        };
    }
}
