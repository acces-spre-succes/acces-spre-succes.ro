package com.test.site_ong.completed_project.controller;

import com.test.site_ong.completed_project.model.CompletedProject;
import com.test.site_ong.completed_project.service.CompletedProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/completed-projects")
public class CompletedProjectController {

    private final CompletedProjectService projectService;

    public CompletedProjectController(CompletedProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<CompletedProject> getAll() {
        return projectService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompletedProject> getProjectById(@PathVariable Long id) {
        CompletedProject project = projectService.getById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CompletedProject> addProject(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            CompletedProject project = projectService.addProject(title, description, image);
            return ResponseEntity.ok(project);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}
