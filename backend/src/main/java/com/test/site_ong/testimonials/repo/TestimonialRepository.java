package com.test.site_ong.testimonials.repo;

import com.test.site_ong.testimonials.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findAllByOrderByDisplayOrderAscIdAsc();
}
