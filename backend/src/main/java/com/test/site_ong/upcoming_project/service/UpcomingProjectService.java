package com.test.site_ong.upcoming_project.service;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.repo.UpcomingProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class UpcomingProjectService {

    private final UpcomingProjectRepository repository;
    private final String uploadDir;

    public UpcomingProjectService(UpcomingProjectRepository repository,
                                  @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.repository = repository;
        this.uploadDir = uploadDir;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
    }

    /** All projects regardless of status (used by admin). */
    public List<UpcomingProject> getAll() {
        return repository.findAllByOrderByIdDesc();
    }

    /** Active / upcoming projects (completed = false) – used by the public site. */
    public List<UpcomingProject> getUpcoming() {
        return repository.findByCompletedFalseOrderByIdDesc();
    }

    /** Finished projects (completed = true) – used by the public site. */
    public List<UpcomingProject> getCompleted() {
        return repository.findByCompletedTrueOrderByIdDesc();
    }

    public UpcomingProject getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public UpcomingProject addProject(String title, String description, MultipartFile image) throws IOException {
        UpcomingProject project = new UpcomingProject();
        project.setTitle(title);
        project.setDescription(description);
        project.setCompleted(false);

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File dest = new File(uploadDir + "/" + fileName);
            image.transferTo(dest);
            project.setImagePath("/uploads/" + fileName);
        }

        return repository.save(project);
    }

    /** Toggle the completed flag and return the updated project. */
    public UpcomingProject toggleStatus(Long id) {
        UpcomingProject project = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        project.setCompleted(!Boolean.TRUE.equals(project.getCompleted()));
        return repository.save(project);
    }

    public void deleteProject(Long id) {
        repository.deleteById(id);
    }
}
