package com.eduflow.auth;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtAccountAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private final AccountDetailsService accounts;

    public JwtAccountAuthenticationConverter(AccountDetailsService accounts) {
        this.accounts = accounts;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UserDetails details = accounts.loadUserByUsername(jwt.getSubject());
        if (!(details instanceof AccountPrincipal principal)) {
            throw new BadCredentialsException("Invalid access token.");
        }
        UserAccount account = principal.account();
        if (!details.isEnabled()) throw new DisabledException("This account is disabled.");
        if (!account.getId().equals(jwt.getClaim("userId"))
                || !account.getCustomId().equals(jwt.getClaimAsString("customId"))
                || !account.getRole().name().equals(jwt.getClaimAsString("role"))
                || !java.util.Objects.equals(principal.schoolId(), jwt.getClaim("schoolId"))) {
            throw new BadCredentialsException("The account no longer matches this access token.");
        }
        return new AccountJwtAuthenticationToken(jwt, principal);
    }
}
