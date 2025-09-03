package com.eustache.virunga.services;

import com.eustache.virunga.DTO.ProductDTO;
import com.eustache.virunga.ProductDAO;
import com.eustache.virunga.ProductMapper;
import com.eustache.virunga.model.Category;
import com.eustache.virunga.model.Product;
import com.eustache.virunga.model.Status;
import com.eustache.virunga.model.TypeProduct;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceImplTest {

    @Mock
    private ProductMapper productMapper;

    @Mock
    private ProductDAO productDAO;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        productDTO = new ProductDTO(
                "Test product",
                10,
                "Sample description",
                Status.NON_URGENT,
                Category.ELECTRICITY,
                TypeProduct.CONSUMABLE,
                LocalDate.now(),
                LocalDate.now()
        );
    }

    @Test
    void createProduct_ShouldReturnCreatedResponse() throws IOException {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(fileStorageService.saveImage(mockFile)).thenReturn("path/to/image.jpg");

        Product product = new Product();
        when(productMapper.toEntity(eq(productDTO), anyString())).thenReturn(product);

        // Act
        ResponseEntity<String> response = productService.createProduct(productDTO, mockFile);

        // Assert
        assertEquals(201, response.getStatusCodeValue());
        assertEquals("Product created successfully", response.getBody());
        verify(productDAO, times(1)).save(product);
    }

    @Test
    void updateProduct_ShouldUpdateAndReturnOk() {
        Integer id = 1;
        Product existing = new Product();
        when(productDAO.findById(id)).thenReturn(Optional.of(existing));

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(true);

        // Act
        ResponseEntity<String> response = productService.updateProduct(id, productDTO, mockFile);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Product updated successfully", response.getBody());
        verify(productDAO, times(1)).save(existing);
    }

    @Test
    void deleteProduct_ShouldReturnOk() {
        // Arrange
        Integer id = 1;
        doNothing().when(productDAO).deleteById(id);

        // Act
        ResponseEntity<String> response = productService.deleteProduct(id);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Product deleted successfully", response.getBody());
        verify(productDAO, times(1)).deleteById(id);
    }

    @Test
    void getAllProducts_ShouldReturnListOfDtos() {

    }
}
