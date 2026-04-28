package com.test.site_ong.stripe.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {
    @Value("${stripe.secret.key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public Map<String, Object> createCheckoutSession(String amount, String donorId, String email, String firstName, String lastName) throws StripeException {
        long amountInCents = (long) (Double.parseDouble(amount) * 100);

        SessionCreateParams params = SessionCreateParams.builder().setUiMode(SessionCreateParams.UiMode.EMBEDDED).setMode(SessionCreateParams.Mode.PAYMENT)
            .setReturnUrl("http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}&donorId=" + donorId)
                .addLineItem(SessionCreateParams.LineItem.builder().setQuantity(1L).setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("ron").setUnitAmount(amountInCents).setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName("Donatie").setDescription("Va multumim pentru donatie!").build()
                                ).build()
                ).build()
        ).setCustomerEmail(email).putMetadata("donorId", donorId).putMetadata("firstName", firstName).putMetadata("lastName", lastName).build();

        Session session = Session.create(params);
        Map<String, Object> response = new HashMap<>();
        response.put("client_secret", session.getClientSecret());
        response.put("session_id", session.getId());

        return response;
    }

    public Map<String, Object> getSessionStatus(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);
        Map<String, String> metadata = session.getMetadata();
        String donorId = metadata.get("donorId");

        Map<String, Object> response = new HashMap<>();
        response.put("status", session.getStatus());
        //response.put("clientSecret", session.getClientSecret());
        response.put("sessionId", session.getId());
        response.put("donorId", donorId);
        response.put("amount", session.getAmountTotal());
        response.put("currency", session.getCurrency());
        response.put("email", session.getCustomerEmail());
        return response;
    }
}
