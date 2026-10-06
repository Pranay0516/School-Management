package com.eduflow.attendance;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"}, allowCredentials = "true")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Attendance> all(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String className) {
        return service.findAll(date, className);
    }

    @PostMapping
    public List<Attendance> save(@RequestBody List<Attendance> records) {
        return service.saveAll(records);
    }
}
