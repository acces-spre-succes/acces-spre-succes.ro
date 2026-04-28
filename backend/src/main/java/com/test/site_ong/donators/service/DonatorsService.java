package com.test.site_ong.donators.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.test.site_ong.donators.model.Donators;
import com.test.site_ong.donators.repo.DonatorsRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DonatorsService {
    //dependency injection (we inject repo)
    private final DonatorsRepo donatorsRepo;


    @Transactional
    public Donators saveDonators(Donators donators) {
        return donatorsRepo.save(donators);
    }

    @Transactional
    public List<Donators> findAllDonators() {
        return donatorsRepo.findAll();
    }

    @Transactional
    public Optional<Donators> findDonatorById(Integer id) {
        return donatorsRepo.findById(id);
    }
    @Transactional
    public List<Donators> findBySubmitDate(LocalDateTime startDate, LocalDateTime endDate) {
        return donatorsRepo.findBySubmitDate(startDate, endDate);
    }

    @Transactional
    public void deleteDonator(Integer id) {
        donatorsRepo.deleteById(id);
    }

}
