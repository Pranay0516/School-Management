package com.eduflow.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public final class AccountPrincipal implements UserDetails {

    private final UserAccount account;

    public AccountPrincipal(UserAccount account) {
        this.account = account;
    }

    public UserAccount account() {
        return account;
    }

    public Long schoolId() {
        return account.getSchool() == null ? null : account.getSchool().getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + account.getRole().name()));
    }

    @Override
    public String getPassword() {
        return account.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return account.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return switch (account.getRole()) {
            case SUPER_ADMIN -> account.getSchool() == null;
            case ADMIN -> account.getSchool() != null && account.getSchool().isActive();
            case TEACHER -> account.getSchool() != null && account.getSchool().isActive()
                    && account.getTeacher() != null
                    && "ACTIVE".equalsIgnoreCase(account.getTeacher().getStatus());
            case STUDENT -> account.getSchool() != null && account.getSchool().isActive()
                    && account.getStudent() != null
                    && "ACTIVE".equalsIgnoreCase(account.getStudent().status);
        };
    }
}
