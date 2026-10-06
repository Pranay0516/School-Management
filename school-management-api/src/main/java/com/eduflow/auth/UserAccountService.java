package com.eduflow.auth;

import com.eduflow.teacher.Teacher;
import com.eduflow.teacher.TeacherRepository;
import com.eduflow.tenant.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserAccountService {

    private final UserAccountRepository accounts;
    private final TeacherRepository teachers;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(
            UserAccountRepository accounts,
            TeacherRepository teachers,
            PasswordEncoder passwordEncoder) {
        this.accounts = accounts;
        this.teachers = teachers;
        this.passwordEncoder = passwordEncoder;
    }

    public UserAccount createInitialSuperAdmin(String username, String rawPassword) {
        String normalized = normalizeUsername(username);
        return accounts.save(new UserAccount(
                normalized, normalized, normalized,
                passwordEncoder.encode(validatePassword(rawPassword)),
                UserAccount.Role.SUPER_ADMIN, normalized, null, null, null));
    }

    public AccountResponse createTeacherAccount(Long teacherId, String username, String rawPassword) {
        Teacher teacher = teachers.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found: " + teacherId));
        if (!"ACTIVE".equalsIgnoreCase(teacher.getStatus())) {
            throw new IllegalArgumentException("Inactive teachers cannot be given a login account.");
        }
        if (accounts.existsByTeacher_Id(teacherId)) {
            throw new IllegalArgumentException("This teacher already has a login account.");
        }

        Long schoolId = TenantContext.requireSchoolId();
        if (!schoolId.equals(teacher.getSchoolId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Cross-school data access is not allowed.");
        }
        UserAccount account = createAccount(
                username, rawPassword, UserAccount.Role.TEACHER, teacher);
        return toResponse(account);
    }

    @Transactional(readOnly = true)
    public java.util.List<AccountResponse> teacherAccounts() {
        return accounts.findAllByRole(UserAccount.Role.TEACHER).stream()
                .map(UserAccountService::toResponse)
                .toList();
    }

    private UserAccount createAccount(
            String username, String rawPassword, UserAccount.Role role, Teacher teacher) {
        String normalizedUsername = normalizeUsername(username);
        if (accounts.existsByUsernameIgnoreCase(normalizedUsername)) {
            throw new IllegalArgumentException("That username is already in use.");
        }
        return accounts.save(new UserAccount(
                teacher.getEmployeeId(),
                teacher.getEmployeeId(),
                normalizedUsername,
                passwordEncoder.encode(validatePassword(rawPassword)),
                role, teacher.getName(), teacher.getSchool(),
                teacher, null));
    }

    private static String normalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }
        String normalized = username.trim().toLowerCase();
        if (normalized.length() > 191) {
            throw new IllegalArgumentException("Username must not exceed 191 characters.");
        }
        return normalized;
    }

    private static String validatePassword(String password) {
        if (password == null || password.length() < 12) {
            throw new IllegalArgumentException("Password must contain at least 12 characters.");
        }
        return password;
    }

    public static AccountResponse toResponse(UserAccount account) {
        Teacher teacher = account.getTeacher();
        return new AccountResponse(
                account.getId(),
                account.getUsername(),
                account.getRole(),
                teacher == null ? null : teacher.getId(),
                teacher == null ? null : teacher.getName());
    }

    public record CreateTeacherAccountRequest(
            @NotBlank @Email @Size(max = 191) String username,
            @NotBlank @Size(min = 12, max = 72) String password) {}

    public record AccountResponse(
            Long id, String username, UserAccount.Role role, Long teacherId, String teacherName) {}
}
