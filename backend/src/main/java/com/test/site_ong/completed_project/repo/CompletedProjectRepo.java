package com.test.site_ong.completed_project.repo;


import com.test.site_ong.completed_project.model.CompletedProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletedProjectRepo extends JpaRepository<CompletedProject, Long> {
}

