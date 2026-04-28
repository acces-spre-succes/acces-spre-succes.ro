package com.test.site_ong.volunteerForm.repo;

import com.test.site_ong.volunteerForm.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRepo extends JpaRepository<Volunteer, Integer> {

    //find volunteer by email
    Volunteer findByEmail(String email);

    //find volunteer by phone number
    Volunteer findByPhoneNumber(String phoneNumber);

}
