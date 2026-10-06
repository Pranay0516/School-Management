package com.eduflow.tenant;

import com.eduflow.school.School;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

@MappedSuperclass
@FilterDef(name = "schoolScope", parameters = @ParamDef(name = "schoolId", type = Long.class))
public abstract class SchoolScopedEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @JsonIgnore
    public School getSchool() { return school; }
    public Long getSchoolId() { return school == null ? null : school.getId(); }

    public void setSchool(School school) {
        this.school = school;
    }

    @PrePersist
    @PreUpdate
    private void enforceTenant() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
            if (school == null || school.getId() == null) {
                throw new AccessDeniedException("Super admins must explicitly scope school data.");
            }
            return;
        }
        Long tenantId = TenantContext.requireSchoolId();
        if (school == null) {
            school = School.reference(tenantId);
        } else if (!tenantId.equals(school.getId())) {
            throw new AccessDeniedException("Cross-school data access is not allowed.");
        }
    }

    @PostLoad
    private void verifyTenantOnLoad() {
        Long tenantId = TenantContext.currentSchoolId();
        if (tenantId != null && (school == null || !tenantId.equals(school.getId()))) {
            throw new AccessDeniedException("Cross-school data access is not allowed.");
        }
    }

    @PreRemove
    private void verifyTenantBeforeDelete() {
        Long tenantId = TenantContext.requireSchoolId();
        if (school == null || !tenantId.equals(school.getId())) {
            throw new AccessDeniedException("Cross-school data access is not allowed.");
        }
    }
}
