package com.test.site_ong.volunteerForm.controller;

import com.test.site_ong.dto.ErrorResponse;
import com.test.site_ong.volunteerForm.model.Volunteer;
import com.test.site_ong.volunteerForm.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
//base URL for all methods in the controller
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {
    //dependency injection (we inject the service)
    private final VolunteerService volunteerService;

    @PostMapping
    public ResponseEntity<?> addVolunteerForm(@RequestBody Volunteer form) {
        try{
            Volunteer savedForm = volunteerService.submitNewForm(form);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedForm);
        }catch(IllegalArgumentException e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid Submission", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<Volunteer>> getAllVolunteers(){
        List<Volunteer> allVolunteers = volunteerService.getAllForms();
        return ResponseEntity.ok(allVolunteers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVolunteerById(@PathVariable Integer id){
        Optional<Volunteer> volunteer = volunteerService.getFormByid(id);
        if (volunteer.isPresent()){
            return ResponseEntity.ok(volunteer.get());
        }else{
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Volunteer not found", "No volunteer with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVolunteerById(@PathVariable Integer id){
        try {
            volunteerService.deleteFormById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch (IllegalArgumentException e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Volunteer not found", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
