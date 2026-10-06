package com.eduflow.auth;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public final class AccountJwtAuthenticationToken extends JwtAuthenticationToken {
    private final AccountPrincipal accountPrincipal;

    public AccountJwtAuthenticationToken(Jwt jwt, AccountPrincipal accountPrincipal) {
        super(jwt, accountPrincipal.getAuthorities(), accountPrincipal.getUsername());
        this.accountPrincipal = accountPrincipal;
    }

    @Override
    public AccountPrincipal getPrincipal() {
        return accountPrincipal;
    }
}
