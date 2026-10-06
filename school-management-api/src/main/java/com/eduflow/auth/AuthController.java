package com.eduflow.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokens;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenService tokens) {
        this.authenticationManager = authenticationManager;
        this.tokens = tokens;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest body) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(body.identifier(), body.password()));
        AccountPrincipal principal = (AccountPrincipal) authentication.getPrincipal();
        UserAccount account = principal.account();
        JwtTokenService.IssuedToken token = tokens.issue(account);
        return new AuthResponse(
                token.value(), token.expiresIn(), account.getId(), account.getCustomId(),
                account.getRole(), principal.schoolId(),
                account.getSchool() == null ? null : account.getSchool().getName(),
                account.getTeacher() == null ? null : account.getTeacher().getId(),
                account.getTeacher() == null ? null : account.getTeacher().getName());
    }

    @GetMapping("/me")
    public AuthResponse currentUser(Authentication authentication) {
        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new IllegalStateException("The authenticated request does not contain a JWT.");
        }
        Jwt jwt = jwtAuthentication.getToken();
        return new AuthResponse(
                null,
                jwt.getExpiresAt() == null ? 0 : Math.max(0, jwt.getExpiresAt().getEpochSecond()
                        - java.time.Instant.now().getEpochSecond()),
                jwt.getClaim("userId"),
                jwt.getClaim("customId"),
                UserAccount.Role.valueOf(jwt.getClaimAsString("role")),
                jwt.getClaim("schoolId"),
                jwt.getClaimAsString("schoolName"),
                null,
                null);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {}

    public record LoginRequest(@NotBlank String identifier, @NotBlank String password) {}

    public record AuthResponse(
            String accessToken,
            long expiresIn,
            Long userId,
            String customId,
            UserAccount.Role role,
            Long schoolId,
            String schoolName,
            Long teacherId,
            String teacherName) {}
}
