package com.test.site_ong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SiteOngApplication {

    public static void main(String[] args) {
        //this is a comment for testing
        SpringApplication.run(SiteOngApplication.class, args);
    }

}