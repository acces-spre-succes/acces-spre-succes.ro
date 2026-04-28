package com.test.site_ong.upcoming_project.controller;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.service.UpcomingProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/upcoming-projects")
public class UpcomingProjectController {
    private final UpcomingProjectService service;

    public UpcomingProjectController(UpcomingProjectService service) {
        this.service = service;
    }

    @GetMapping
    public List<UpcomingProject> getAllProjects() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UpcomingProject> getProjectById(@PathVariable Long id) {
        UpcomingProject project = service.getById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UpcomingProject> addProject(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            UpcomingProject project = service.addProject(title, description, image);
            return ResponseEntity.ok(project);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        service.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}
