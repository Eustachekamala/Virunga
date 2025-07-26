package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Product;
import com.eustache.virunga.product.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductDAO extends JpaRepository<Product, Integer> {
    Optional<Product> findByName(String name);
    Optional<Product> findProductByTypeProduct(Type typeProduct);
}
