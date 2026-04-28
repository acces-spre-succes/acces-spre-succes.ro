package com.test.site_ong.donators.controller;

import com.test.site_ong.donators.model.Donators;
import com.test.site_ong.donators.service.DonatorsService;
import com.test.site_ong.dto.ErrorResponse;
import com.test.site_ong.stripe.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/donators")
@RequiredArgsConstructor
public class DonatorsController {

    //dependency injection
    private final DonatorsService donatorsService;
    private final StripeService stripeService;

    @PostMapping("/add-donor")
    public ResponseEntity<?> addDonators(@RequestBody Donators donators) {
        try{
            donators.setPaymentStatus("pending");
            donators.setSubmitDate(LocalDateTime.now());
            Donators savedDonators = donatorsService.saveDonators(donators);
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedDonators.getId());
            response.put("status", "pending");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch(IllegalArgumentException e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid Submission" , e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    @PostMapping("/update-payment-status")
    public ResponseEntity<?> updatePaymentStatus(@RequestBody Map<String, String> request) {
        try{
            String donorId = request.get("donorId");
            System.out.println(donorId);
            String stripeSessionId = request.get("stripeSessionId");

            Optional<Donators> donatorOpt = donatorsService.findDonatorById(Integer.parseInt(donorId));

            if (donatorOpt.isPresent()) {
                Donators donator = donatorOpt.get();
                donator.setPaymentStatus("completed");
                donator.setPaymentIntentId(stripeSessionId);
                donatorsService.saveDonators(donator);

                return ResponseEntity.ok().build();
            }else {
                ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Donator not found", request.get("stripeSessionId"));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        }catch (Exception e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Payment update failed" , e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, String> request) {
        try{
            String amount = request.get("amount");
            String donorId = request.get("donorId");
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");

            Map<String, Object> sessionData = stripeService.createCheckoutSession(amount, donorId, email, firstName, lastName);
            return ResponseEntity.ok(sessionData);
        }catch (Exception e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Create checkout session failed" , e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/session-status")
    public ResponseEntity<?> getSessionStatus(@RequestParam String sessionId) {
        try{
            Map<String, Object> sessionData = stripeService.getSessionStatus(sessionId);
            return ResponseEntity.ok(sessionData);
        }catch (Exception e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Session not found" , e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @GetMapping("by-date")
    public ResponseEntity<?> getDonatorsBySubmitDate(@RequestParam LocalDateTime startDate, LocalDateTime endDate) {
        List<Donators> donatorsByDate = donatorsService.findBySubmitDate(startDate, endDate);
        if (!donatorsByDate.isEmpty()) {
            return ResponseEntity.ok(donatorsByDate);
        }else {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "No donators found" , "No donations were found in the given date");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDonatorById(@PathVariable Integer id) {
        Optional<Donators> donator = donatorsService.findDonatorById(id);
        if (donator.isPresent()) {
            return ResponseEntity.ok(donator.get());
        }else {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "No donator found" , "No donators were found in the given id");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonatorById(@PathVariable Integer id) {
        try {
            donatorsService.deleteDonator(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch (IllegalArgumentException e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Donator not found" , e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

}
