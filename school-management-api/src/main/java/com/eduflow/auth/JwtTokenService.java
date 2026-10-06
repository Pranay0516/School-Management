package com.eduflow.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class JwtTokenService {
    private final JwtEncoder encoder;
    private final long tokenLifetimeSeconds;

    public JwtTokenService(
            JwtEncoder encoder,
            @Value("${app.security.jwt.lifetime-seconds:1800}") long tokenLifetimeSeconds) {
        this.encoder = encoder;
        this.tokenLifetimeSeconds = tokenLifetimeSeconds;
    }

    public IssuedToken issue(UserAccount account) {
        Instant now = Instant.now();
        Long schoolId = account.getSchool() == null ? null : account.getSchool().getId();
        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuer("school-management")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(tokenLifetimeSeconds))
                .subject(account.getUsername())
                .claim("userId", account.getId())
                .claim("customId", account.getCustomId())
                .claim("role", account.getRole().name())
                .claim("authorities", List.of("ROLE_" + account.getRole().name()));
        if (schoolId != null) {
            claimsBuilder.claim("schoolId", schoolId);
            claimsBuilder.claim("schoolName", account.getSchool().getName());
        }
        JwtClaimsSet claims = claimsBuilder.build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return new IssuedToken(encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue(),
                tokenLifetimeSeconds);
    }

    public record IssuedToken(String value, long expiresIn) {}
}
