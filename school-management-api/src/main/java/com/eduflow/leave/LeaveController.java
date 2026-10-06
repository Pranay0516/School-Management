package com.eduflow.leave;

import com.eduflow.auth.AccountPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"}, allowCredentials = "true")
public class LeaveController {

    private final LeaveService service;

    public LeaveController(LeaveService service) {
        this.service = service;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TEACHER')")
    public List<LeaveService.LeaveResponse> mine(@AuthenticationPrincipal AccountPrincipal principal) {
        return service.findMine(principal);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TEACHER')")
    public LeaveService.LeaveResponse apply(
            @AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody LeaveService.CreateLeaveRequest request) {
        return service.apply(principal, request);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<LeaveService.LeaveResponse> allForAdmin() {
        return service.findAllForAdmin();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public LeaveService.LeaveResponse approve(
            @PathVariable Long id,
            @AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody(required = false) LeaveService.DecisionRequest request) {
        return service.approve(id, principal.getUsername(), request == null ? null : request.note());
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public LeaveService.LeaveResponse reject(
            @PathVariable Long id,
            AccountPrincipal principal,
            @Valid @RequestBody LeaveService.RejectRequest request) {
        return service.reject(id, principal.getUsername(), request.note());
    }
}
