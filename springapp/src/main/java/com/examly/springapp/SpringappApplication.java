package com.examly.springapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SpringappApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringappApplication.class, args);
        System.out.println(new BCryptPasswordEncoder().encode("Kavi@26"));
    }
}
