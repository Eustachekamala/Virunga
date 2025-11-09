package com.eustache.virunga.DAO;

import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.TypeProduct;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductDAO extends JpaRepository<Product, Integer> {
    Optional<Product> findByName(String name);
    List<Product> findByTypeProduct(TypeProduct typeProduct);
}
