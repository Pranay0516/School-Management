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
@RequestMapping("/api/v1/super-admin/schools")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {
    private final SchoolOnboardingService onboarding;

    public SuperAdminController(SchoolOnboardingService onboarding) {
        this.onboarding = onboarding;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SchoolOnboardingService.SchoolCreated createSchool(
            @Valid @RequestBody SchoolOnboardingService.CreateSchoolRequest request) {
        return onboarding.createSchool(request);
    }

    @GetMapping
    public List<SchoolOnboardingService.SchoolSummary> listSchools() {
        return onboarding.listSchools();
    }
}
