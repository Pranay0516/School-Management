package com.eduflow.teacher;

import com.eduflow.auth.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"}, allowCredentials = "true")
public class TeacherController {

    private final TeacherService service;
    private final UserAccountService accountService;

    public TeacherController(TeacherService service, UserAccountService accountService) {
        this.service = service;
        this.accountService = accountService;
    }

    @GetMapping
    public List<Teacher> all(@RequestParam(required = false) String search) {
        return service.findAll(search);
    }

    @GetMapping("/{id}")
    public Teacher getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/accounts")
    public List<UserAccountService.AccountResponse> accounts() {
        return accountService.teacherAccounts();
    }

    @PostMapping("/{id}/account")
    @ResponseStatus(HttpStatus.CREATED)
    public UserAccountService.AccountResponse createAccount(
            @PathVariable Long id,
            @Valid @RequestBody UserAccountService.CreateTeacherAccountRequest request) {
        return accountService.createTeacherAccount(id, request.username(), request.password());
    }

    @PostMapping
    public ResponseEntity<Teacher> create(@Valid @RequestBody Teacher teacher) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(teacher));
    }

    @PutMapping("/{id}")
    public Teacher update(@PathVariable Long id, @Valid @RequestBody Teacher teacher) {
        return service.update(id, teacher);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public TeacherStats stats() {
        return new TeacherStats(service.countActive());
    }

    public record TeacherStats(long totalActive) {}
}
