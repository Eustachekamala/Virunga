package com.eustache.virunga;

import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductDAO extends JpaRepository<Product, Integer> {
    Optional<Product> findByName(String name);
    Optional<Product> findProductByTypeProduct(Type typeProduct);
}
