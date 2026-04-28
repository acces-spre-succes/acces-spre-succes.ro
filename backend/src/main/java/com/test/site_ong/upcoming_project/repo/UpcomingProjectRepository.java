package com.test.site_ong.upcoming_project.repo;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UpcomingProjectRepository extends JpaRepository<UpcomingProject, Long> {
}
