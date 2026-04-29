package com.test.site_ong.team.controller;

import com.test.site_ong.team.model.TeamMember;
import com.test.site_ong.team.service.TeamMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/team")
public class TeamMemberController {

    private final TeamMemberService service;

    public TeamMemberController(TeamMemberService service) {
        this.service = service;
    }

    @GetMapping
    public List<TeamMember> getAll(@RequestParam(required = false) String department) {
        if (department != null && !department.isBlank()) {
            return service.getByDepartment(department);
        }
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamMember> getById(@PathVariable Long id) {
        TeamMember m = service.getById(id);
        return m == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(m);
    }

    @PostMapping
    public ResponseEntity<TeamMember> create(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) Integer displayOrder,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            return ResponseEntity.ok(service.create(firstName, lastName, email, role, bio, displayOrder, department, photo));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> update(
            @PathVariable Long id,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) Integer displayOrder,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            TeamMember m = service.update(id, firstName, lastName, email, role, bio, displayOrder, department, photo);
            return m == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(m);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
