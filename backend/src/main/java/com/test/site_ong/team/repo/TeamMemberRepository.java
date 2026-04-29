package com.test.site_ong.team.repo;

import com.test.site_ong.team.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findAllByOrderByDisplayOrderAscIdAsc();
}
