package com.test.site_ong.upcoming_project.repo;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UpcomingProjectRepository extends JpaRepository<UpcomingProject, Long> {
    List<UpcomingProject> findByCompletedFalseOrderByIdDesc();
    List<UpcomingProject> findByCompletedTrueOrderByIdDesc();
    List<UpcomingProject> findAllByOrderByIdDesc();
}
