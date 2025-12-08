package com.eustache.virunga.DTO;

import org.springframework.web.multipart.MultipartFile;

import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.TypeProduct;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {

    private String name;

    private Integer quantity;

    private String description;
    private Category category;
    private TypeProduct typeProduct;
    private MultipartFile imageFile;
}
