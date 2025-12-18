package com.eustache.virunga.DAO;

import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.TypeProduct;
import com.eustache.virunga.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductDAO extends JpaRepository<Product, Integer> {
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Optional<Product> findByName(String name);

    List<Product> findByTypeProduct(TypeProduct typeProduct);

    List<Product> findByCategory(Category category);
}
