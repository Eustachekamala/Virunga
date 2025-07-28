package com.eustache.virunga.Request;

import com.eustache.virunga.DTO.ProductDTO;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductRequest {
    private final ProductDTO productDTO;
    private MultipartFile file;
}
