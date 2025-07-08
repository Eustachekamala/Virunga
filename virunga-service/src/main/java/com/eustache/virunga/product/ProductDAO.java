package com.eustache.virunga.product;

import com.eustache.virunga.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatusCode;

import java.util.Optional;

public interface ProductDAO extends JpaRepository<Product, Integer> {
    Optional<Product> findByName(String name);
}
