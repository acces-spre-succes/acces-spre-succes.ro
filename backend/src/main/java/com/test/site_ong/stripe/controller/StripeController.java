package com.test.site_ong.stripe.controller;


import com.stripe.exception.StripeException;
import com.test.site_ong.stripe.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@RequiredArgsConstructor
public class StripeController {
    private final StripeService stripeService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, String> request) throws StripeException {
        String amount = request.get("amount");
        String donorId = request.get("donorId");
        String email = request.get("email");
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");

        Map<String, Object> sessionData = stripeService.createCheckoutSession(amount, donorId, email, firstName, lastName);
        return ResponseEntity.ok(sessionData);
    }


    @GetMapping("/session-status")
    public ResponseEntity<?> getSessionStatus(@RequestParam String session_id) throws StripeException {
        Map<String, Object> sessionData = stripeService.getSessionStatus(session_id);
        return ResponseEntity.ok(sessionData);
    }
}
