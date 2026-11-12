package com.proyecto.backend_2.core.media.services;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface MediaServiceInterface {
    void init() throws IOException;

    String store(MultipartFile multipartFile);

    // String storeDocument(MultipartFile multipartFile);
    Resource loadAsResource(String fileName);
}