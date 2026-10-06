package com.eduflow.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminAccountBootstrap implements ApplicationRunner {

    private final String username;
    private final String password;
    private final UserAccountRepository accounts;
    private final UserAccountService accountService;

    public AdminAccountBootstrap(
            @Value("${app.bootstrap-admin.username:}") String username,
            @Value("${app.bootstrap-admin.password:}") String password,
            UserAccountRepository accounts,
            UserAccountService accountService) {
        this.username = username;
        this.password = password;
        this.accounts = accounts;
        this.accountService = accountService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (username.isBlank() && password.isBlank()) {
            return;
        }
        if (username.isBlank() || password.isBlank()) {
            throw new IllegalStateException(
                    "Set both APP_BOOTSTRAP_ADMIN_USERNAME and APP_BOOTSTRAP_ADMIN_PASSWORD.");
        }
        if (!accounts.existsByUsernameIgnoreCase(username.trim())) {
            accountService.createInitialAdmin(username, password);
        }
    }
}
