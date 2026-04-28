package com.test.site_ong.upcoming_project.service;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.repo.UpcomingProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class UpcomingProjectService {
    private final UpcomingProjectRepository repository;
    private final String uploadDir = "uploads";

    public UpcomingProjectService(UpcomingProjectRepository repository) {
        this.repository = repository;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
    }

    public List<UpcomingProject> getAll() {
        return repository.findAll();
    }

    public UpcomingProject getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public UpcomingProject addProject(String title, String description, MultipartFile image) throws IOException {
        UpcomingProject project = new UpcomingProject();
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
