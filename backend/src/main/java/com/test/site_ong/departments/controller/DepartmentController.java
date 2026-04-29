package com.test.site_ong.departments.controller;

import com.test.site_ong.departments.model.Department;
import com.test.site_ong.departments.service.DepartmentService;
import com.test.site_ong.team.model.TeamMember;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Department> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getById(@PathVariable Long id) {
        Department d = service.getById(id);
        return d == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(d);
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<TeamMember>> getMembers(@PathVariable Long id) {
        if (service.getById(id) == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.getMembers(id));
    }

    @PostMapping
    public ResponseEntity<Department> create(@RequestBody Department body) {
        if (body.getName() == null || body.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.create(body.getName(), body.getDescription(), body.getDisplayOrder()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Long id, @RequestBody Department body) {
        Department d = service.update(id, body.getName(), body.getDescription(), body.getDisplayOrder());
        return d == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(d);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
