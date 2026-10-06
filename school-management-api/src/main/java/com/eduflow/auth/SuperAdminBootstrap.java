package com.eduflow.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SuperAdminBootstrap implements ApplicationRunner {
    private final String username;
    private final String password;
    private final UserAccountRepository accounts;
    private final UserAccountService service;

    public SuperAdminBootstrap(
            @Value("${app.bootstrap-super-admin.username:}") String username,
            @Value("${app.bootstrap-super-admin.password:}") String password,
            UserAccountRepository accounts,
            UserAccountService service) {
        this.username = username;
        this.password = password;
        this.accounts = accounts;
        this.service = service;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (username.isBlank() && password.isBlank()) return;
        if (username.isBlank() || password.isBlank()) {
            throw new IllegalStateException(
                    "Set both APP_BOOTSTRAP_SUPER_ADMIN_USERNAME and APP_BOOTSTRAP_SUPER_ADMIN_PASSWORD.");
        }
        var existing = accounts.findByUsernameIgnoreCase(username.trim());
        if (existing.isPresent()) {
            if (existing.get().getRole() != UserAccount.Role.SUPER_ADMIN) {
                throw new IllegalStateException(
                        "The configured bootstrap username belongs to a non-super-admin account.");
            }
            return;
        }
        service.createInitialSuperAdmin(username, password);
    }
}
