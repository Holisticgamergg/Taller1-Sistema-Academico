package com.proyecto.backend_2.core.date;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/date")
public class DateController {
    @GetMapping
    public LocalDate getDate() {
        return LocalDate.now();
    }
}
