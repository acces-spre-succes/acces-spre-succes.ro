package com.test.site_ong.departments.repo;

import com.test.site_ong.departments.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByOrderByDisplayOrderAscIdAsc();

    Optional<Department> findByNameIgnoreCase(String name);
}
