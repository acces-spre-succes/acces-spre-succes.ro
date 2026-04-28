package com.test.site_ong.completed_project.service;

import com.test.site_ong.completed_project.model.CompletedProject;
import com.test.site_ong.completed_project.repo.CompletedProjectRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class CompletedProjectService {
    private final CompletedProjectRepo repository;
    private final String uploadDir = "uploads";

    public CompletedProjectService(CompletedProjectRepo repository) {
        this.repository = repository;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
    }

    public List<CompletedProject> getAll() {
        return repository.findAll();
    }

    public CompletedProject getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public CompletedProject addProject(String title, String description, MultipartFile image) throws IOException {
        CompletedProject project = new CompletedProject();
        project.setTitle(title);
        project.setDescription(description);

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File dest = new File(uploadDir + "/" + fileName);
            image.transferTo(dest);
            project.setImagePath("/uploads/" + fileName);
        }

        return repository.save(project);
    }

    public void deleteProject(Long id) {
        repository.deleteById(id);
    }
}
