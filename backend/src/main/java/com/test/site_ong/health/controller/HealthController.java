package com.test.site_ong.health.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController

public class HealthController {
    private final DataSource dataSource;
    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/api/test")
    public String testDb(){
        try(Connection conn = dataSource.getConnection()){
            return "Conectat la " + conn.getMetaData().getURL();
        }catch (Exception e){
            return "Eroare DB: " + e.getMessage();
        }
    }
}
