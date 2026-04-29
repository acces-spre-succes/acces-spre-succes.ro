package com.test.site_ong.departments.service;

import com.test.site_ong.departments.model.Department;
import com.test.site_ong.departments.repo.DepartmentRepository;
import com.test.site_ong.team.model.TeamMember;
import com.test.site_ong.team.repo.TeamMemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository repo;
    private final TeamMemberRepository memberRepo;

    public List<Department> getAll() {
        return repo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    public Department getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Department create(String name, String description, Integer displayOrder) {
        Department d = new Department();
        d.setName(name.trim());
        d.setDescription(description);
        d.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        return repo.save(d);
    }

    public Department update(Long id, String name, String description, Integer displayOrder) {
        Department d = repo.findById(id).orElse(null);
        if (d == null) return null;
        if (name != null && !name.isBlank()) d.setName(name.trim());
        d.setDescription(description);
        if (displayOrder != null) d.setDisplayOrder(displayOrder);
        return repo.save(d);
    }

    /**
     * Deleting a department first removes it from every team member that
     * references it, so the M:N join rows go away cleanly without
     * requiring CascadeType.ALL on either side. Bidirectional cascade
     * would be too aggressive (would risk deleting members on dept delete).
     */
    @Transactional
    public boolean delete(Long id) {
        Department d = repo.findById(id).orElse(null);
        if (d == null) return false;

        List<TeamMember> affected = memberRepo.findByDepartments_IdOrderByDisplayOrderAscIdAsc(id);
        for (TeamMember m : affected) {
            m.getDepartments().removeIf(dep -> dep.getId().equals(id));
        }
        memberRepo.saveAll(affected);

        repo.delete(d);
        return true;
    }

    public List<TeamMember> getMembers(Long departmentId) {
        return memberRepo.findByDepartments_IdOrderByDisplayOrderAscIdAsc(departmentId);
    }
}
