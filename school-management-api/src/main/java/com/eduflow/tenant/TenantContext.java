package com.eduflow.tenant;

import com.eduflow.auth.AccountPrincipal;
import com.eduflow.auth.UserAccount;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public final class TenantContext {
    private TenantContext() {}

    public static Long currentSchoolId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof AccountPrincipal accountPrincipal) {
            return accountPrincipal.schoolId();
        }
        if (principal instanceof Jwt jwt) {
            return jwt.getClaim("schoolId");
        }
        return null;
    }

    public static Long requireSchoolId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
            throw new AccessDeniedException("A school-scoped account is required.");
        }
        Long schoolId = currentSchoolId();
        if (schoolId == null) throw new AccessDeniedException("The account is not assigned to a school.");
        return schoolId;
    }

    public static Long schoolIdOf(UserAccount account) {
        return account.getSchool() == null ? null : account.getSchool().getId();
    }
}
