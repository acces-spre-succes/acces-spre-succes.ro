package com.test.site_ong.upcoming_project.service;

import com.test.site_ong.team.model.TeamMember;
import com.test.site_ong.team.repo.TeamMemberRepository;
import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.repo.UpcomingProjectRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UpcomingProjectService {

    private final UpcomingProjectRepository repository;
    private final TeamMemberRepository teamMemberRepository;
    private final String uploadDir;

    public UpcomingProjectService(UpcomingProjectRepository repository,
                                  TeamMemberRepository teamMemberRepository,
                                  @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.repository = repository;
        this.teamMemberRepository = teamMemberRepository;
        this.uploadDir = uploadDir;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
    }

    // ── Slug helpers ──────────────────────────────────────────────────────────

    /** Convert a title to a URL-safe slug (handles Romanian diacritics). */
    private static String toSlug(String title) {
        if (title == null || title.isBlank()) return "";
        // NFD decomposition strips combining diacritics (ă→a, â→a, î→i, ș→s, ț→t …)
        String s = Normalizer.normalize(title, Normalizer.Form.NFD);
        s = s.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        s = s.toLowerCase();
        s = s.replaceAll("[^a-z0-9]+", "-");
        s = s.replaceAll("^-+|-+$", "");
        return s;
    }

    /** Return a slug that is unique in the DB, appending -2, -3 … if needed. */
    private String uniqueSlug(String base, Long excludeId) {
        String candidate = base;
        int suffix = 2;
        while (true) {
            Optional<UpcomingProject> conflict = repository.findBySlug(candidate);
            if (conflict.isEmpty() || conflict.get().getId().equals(excludeId)) return candidate;
            candidate = base + "-" + suffix++;
        }
    }

    /** Backfill slugs for projects created before this field was introduced. */
    @PostConstruct
    public void backfillSlugs() {
        repository.findAll().forEach(p -> {
            if (p.getSlug() == null || p.getSlug().isBlank()) {
                p.setSlug(uniqueSlug(toSlug(p.getTitle()), p.getId()));
                repository.save(p);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────

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

    public UpcomingProject getBySlug(String slug) {
        return repository.findBySlug(slug).orElse(null);
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

        // Generate a unique slug from the title
        project.setSlug(uniqueSlug(toSlug(title), null));

        return repository.save(project);
    }

    public UpcomingProject updateProject(Long id, String title, String description, MultipartFile image) throws IOException {
        UpcomingProject project = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
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

    /**
     * Replace the volunteer list on a project (project-centric assignment).
     *
     * The join table is owned by TeamMember.projects, so we update it from
     * that side only. We use a clean-slate approach (remove all, then add new)
     * and compare by ID to avoid any Lombok equals() ambiguity.
     */
    @Transactional
    public UpcomingProject setVolunteers(Long projectId, List<Long> memberIds) {
        UpcomingProject project = repository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        List<Long> safeIds = (memberIds == null) ? new ArrayList<>() : memberIds;

        // Step 1: remove this project from every current volunteer (owning side)
        for (TeamMember m : new ArrayList<>(project.getVolunteers())) {
            m.getProjects().removeIf(p -> p.getId().equals(projectId));
            teamMemberRepository.save(m);
        }

        // Step 2: add this project to each newly-assigned volunteer (owning side)
        List<TeamMember> newVolunteers = safeIds.isEmpty()
                ? new ArrayList<>()
                : new ArrayList<>(teamMemberRepository.findAllById(safeIds));
        for (TeamMember m : newVolunteers) {
            m.getProjects().add(project);
            teamMemberRepository.save(m);
        }

        // Update the in-memory inverse collection so the response is accurate
        project.setVolunteers(newVolunteers);
        return project;
    }
}
