package com.proyecto.backend_2.core.media.services;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class MediaService implements MediaServiceInterface {
	@Value("${media.location}")
	private String mediaLocation;

	private Path rootLocation;

	@PostConstruct
	public void init() throws IOException {
		rootLocation = Paths.get(mediaLocation);
		Files.createDirectories(rootLocation);
	}

	public String store(MultipartFile multipartFile) {
		try {
			if (multipartFile.isEmpty()) {
				throw new RuntimeException("Ocurrio un error");
			}
			String originalFilename = multipartFile.getOriginalFilename();
			String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
			Path destinationFile = rootLocation.resolve(Paths.get(uniqueFilename)).normalize().toAbsolutePath();
			try (InputStream inputStream = multipartFile.getInputStream()) {
				Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
			}
			return uniqueFilename;
		} catch (IOException e) {
			throw new RuntimeException("Ocurrio un error");
		}
	}

	/*
	 * public String storeDocument(MultipartFile multipartFile) {
	 * try {
	 * if (multipartFile.isEmpty()) {
	 * throw new RuntimeException("Ocurrio un error");
	 * }
	 * String originalFilename = multipartFile.getOriginalFilename();
	 * String uniqueFilename = UUID.randomUUID().toString() + "_" +
	 * originalFilename;
	 * Path destinationFile =
	 * rootDocumentsLocation.resolve(Paths.get(uniqueFilename)).normalize().
	 * toAbsolutePath();
	 * try (InputStream inputStream = multipartFile.getInputStream()) {
	 * Files.copy(inputStream, destinationFile,
	 * StandardCopyOption.REPLACE_EXISTING);
	 * }
	 * return uniqueFilename;
	 * } catch (IOException e) {
	 * throw new RuntimeException("Ocurrio un error");
	 * }
	 * }
	 */

	public Resource loadAsResource(String fileName) {
		try {
			Path file = rootLocation.resolve(fileName);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new RuntimeException("Archivo no encontrado");
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Ocurrio un error");
		}
	}
}
