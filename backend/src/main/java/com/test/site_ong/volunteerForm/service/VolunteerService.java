package com.test.site_ong.volunteerForm.service;

import com.test.site_ong.volunteerForm.model.Volunteer;
import com.test.site_ong.volunteerForm.repo.VolunteerRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VolunteerService {
    //dependency injection (we inject the repository)
    private final VolunteerRepo volunteerRepository;


    //saving a new form into our database
    @Transactional
    public Volunteer submitNewForm(Volunteer form){


        if (volunteerRepository.findByEmail(form.getEmail()) != null){
            throw new IllegalArgumentException("A volunteer with this email already exists.");
        }

        if (volunteerRepository.findByPhoneNumber(form.getPhoneNumber()) != null){
            throw new IllegalArgumentException("A volunteer with this phone number already exists.");
        }

        return volunteerRepository.save(form);
    }

    //extracting all volunteer forms from our database
    @Transactional
    public List<Volunteer> getAllForms(){
        return volunteerRepository.findAll();
    }

    //get form by id
    @Transactional
    public Optional<Volunteer> getFormByid(Integer id){
        return volunteerRepository.findById(id);
    }

    //delete the form
    @Transactional
    public void deleteFormById(Integer id){
        volunteerRepository.deleteById(id);
    }
}
