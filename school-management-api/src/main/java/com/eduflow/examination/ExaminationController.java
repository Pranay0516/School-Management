package com.eduflow.examination;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
@CrossOrigin(origins = "http://localhost:4200")
public class ExaminationController {

    private final ExaminationService service;

    public ExaminationController(ExaminationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Examination> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Examination getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Examination> create(@RequestBody Examination exam) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(exam));
    }

    @PutMapping("/{id}")
    public Examination update(@PathVariable Long id, @RequestBody Examination exam) {
        return service.update(id, exam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
