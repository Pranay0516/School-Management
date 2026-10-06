package com.eduflow.tenant;

import jakarta.persistence.EntityManager;
import org.hibernate.Session;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class TenantFilterConfiguration implements WebMvcConfigurer {
    private final EntityManager entityManager;

    public TenantFilterConfiguration(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(
                    jakarta.servlet.http.HttpServletRequest request,
                    jakarta.servlet.http.HttpServletResponse response,
                    Object handler) {
                if (!request.getRequestURI().startsWith("/api/")) return true;
                if (request.getRequestURI().startsWith("/api/v1/auth/")) return true;
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated()) return true;
                if (authentication.getAuthorities().stream()
                        .anyMatch(authority -> authority.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
                    return true;
                }
                Long schoolId = TenantContext.currentSchoolId();
                if (schoolId == null) {
                    throw new AccessDeniedException("The signed-in account is not assigned to a school.");
                }
                Session session = entityManager.unwrap(Session.class);
                session.enableFilter("schoolScope").setParameter("schoolId", schoolId);
                return true;
            }
        });
    }
}
