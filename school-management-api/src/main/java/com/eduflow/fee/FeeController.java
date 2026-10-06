package com.eduflow.fee;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"}, allowCredentials = "true")
public class FeeController {

    private final FeeService service;

    public FeeController(FeeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Fee> all(@RequestParam(required = false) Long studentId) {
        return studentId != null ? service.findByStudentId(studentId) : service.findAll();
    }

    @PostMapping
    public ResponseEntity<Fee> create(@RequestBody Fee fee) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(fee));
    }

    @PutMapping("/{id}")
    public Fee update(@PathVariable Long id, @RequestBody Fee fee) {
        return service.update(id, fee);
    }

    @PostMapping("/{id}/pay")
    public Fee markPaid(@PathVariable Long id) {
        return service.markPaid(id);
    }

    @GetMapping("/stats")
    public FeeStats stats() {
        return new FeeStats(service.countPending());
    }

    public record FeeStats(long pendingCount) {}
}
