package com.eustache.virunga.product.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private int quantity;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Type typeProduct;
    @Column(nullable = true)
    private String description;
    private Date createdAt;
    private Date updatedAt;
    @Column(nullable = true)
    private String image;
}

