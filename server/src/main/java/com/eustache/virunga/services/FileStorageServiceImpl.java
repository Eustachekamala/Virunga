package com.eustache.virunga.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import com.cloudinary.Cloudinary;
import java.util.Map;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("rawtypes")
    @Override
    public String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Cannot upload empty file");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "folder", "virunga_products"));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new IOException("Failed to upload image to Cloudinary", e);
        }
    }
}
