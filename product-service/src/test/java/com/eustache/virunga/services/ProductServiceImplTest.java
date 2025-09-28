package com.eustache.virunga.services;

import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.ProductDAO;
import com.eustache.virunga.ProductMapper;
import org.junit.jupiter.api.BeforeEach;

import java.io.IOException;

public class ProductServiceImplTest {
    @Mock
    private ProductDAO productDAO;
    @Mock
    private ProductMapper productMapper;
    @Mock
    private FileStorageService fileStorageService;
    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProductShouldCreateProductSuccessfully() throws IOException {
        ProductDTO productDTO = new ProductDTO(
                "Test Product",
                10,
                "A sample product",
                Status.NON_URGENT,
                Category.ELECTRICITY,
                TypeProduct.NON_CONSUMABLE
        );
        MultipartFile imageFile = mock(MultipartFile.class);
        when(imageFile.isEmpty()).thenReturn(false);
        when(fileStorageService.saveImage(imageFile)).thenReturn("/uploads/test.jpg");

        Product product = new Product();
        product.setName(productDTO.name());
        product.setQuantity(productDTO.quantity());
        product.setDescription(productDTO.description());
        product.setStatus(productDTO.status());
        product.setCategory(productDTO.category());
        product.setTypeProduct(productDTO.typeProduct());
        product.setImageFile("/uploads/test.jpg");

        when(productMapper.toEntity(productDTO, "/uploads/test.jpg")).thenReturn(product);
        when(productDAO.save(product)).thenReturn(product);

        ResponseEntity<String> response = productService.createProduct(productDTO, imageFile);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Product created successfully", response.getBody());
        verify(productDAO).save(product);
    }

    @Test
    void updateProduct() {
    }

    @Test
    void deleteProduct() {
    }

    @Test
    void getAllProducts() {
    }

    @Test
    void getProductById() {
    }

    @Test
    void getProductByName() {
    }

    @Test
    void getProductByConsumable() {
    }

    @Test
    void getProductByNoConsumable() {
    }

    @Test
    void getLowStockProducts() {
    }
}
