package com.eduflow.school;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/members")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMembersController {
    private final SchoolOnboardingService onboarding;

    public AdminMembersController(SchoolOnboardingService onboarding) {
        this.onboarding = onboarding;
    }

    @GetMapping
    public List<SchoolOnboardingService.MemberSummary> listMembers() {
        return onboarding.listMembers();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SchoolOnboardingService.MemberCreated createMember(
            @Valid @RequestBody SchoolOnboardingService.CreateMemberRequest request) {
        return onboarding.createMember(request);
    }
}
