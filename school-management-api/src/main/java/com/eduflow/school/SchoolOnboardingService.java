package com.eduflow.school;

import com.eduflow.auth.UserAccount;
import com.eduflow.auth.UserAccountRepository;
import com.eduflow.dashboard.SchoolProfile;
import com.eduflow.dashboard.SchoolProfileRepository;
import com.eduflow.menu.Menu;
import com.eduflow.menu.MenuRepository;
import com.eduflow.teacher.Teacher;
import com.eduflow.teacher.TeacherRepository;
import com.eduflow.student.Student;
import com.eduflow.student.StudentRepository;
import com.eduflow.tenant.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class SchoolOnboardingService {
    private final SchoolRepository schools;
    private final SchoolIdSequenceRepository sequences;
    private final SchoolIdGenerator ids;
    private final UserAccountRepository accounts;
    private final PasswordEncoder passwordEncoder;
    private final SchoolProfileRepository profiles;
    private final MenuRepository menus;
    private final TeacherRepository teachers;
    private final StudentRepository students;

    public SchoolOnboardingService(
            SchoolRepository schools,
            SchoolIdSequenceRepository sequences,
            SchoolIdGenerator ids,
            UserAccountRepository accounts,
            PasswordEncoder passwordEncoder,
            SchoolProfileRepository profiles,
            MenuRepository menus,
            TeacherRepository teachers,
            StudentRepository students) {
        this.schools = schools;
        this.sequences = sequences;
        this.ids = ids;
        this.accounts = accounts;
        this.passwordEncoder = passwordEncoder;
        this.profiles = profiles;
        this.menus = menus;
        this.teachers = teachers;
        this.students = students;
    }

    @Transactional
    public SchoolCreated createSchool(CreateSchoolRequest request) {
        String code = request.schoolCode().trim().toUpperCase();
        if (schools.existsByCodeIgnoreCase(code)) {
            throw new IllegalArgumentException("That school code is already registered.");
        }
        School school = schools.saveAndFlush(
                new School(request.schoolName().trim(), code, request.city().trim()));
        for (SchoolIdSequence.MemberRole role : SchoolIdSequence.MemberRole.values()) {
            sequences.save(new SchoolIdSequence(school, role, SchoolIdGenerator.initialValue(role)));
        }
        sequences.flush();

        String customId = ids.nextId(school.getId(), SchoolIdSequence.MemberRole.ADMIN);
        UserAccount primaryAdmin = accounts.save(new UserAccount(
                customId, customId, request.adminEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.adminPassword()),
                UserAccount.Role.ADMIN, request.adminName().trim(), school, null, null));

        SchoolProfile profile = new SchoolProfile();
        profile.schoolName = school.getName();
        profile.seatCapacity = 0;
        profile.setSchool(school);
        profiles.save(profile);
        seedSchoolMenus(school);
        return new SchoolCreated(school.getId(), school.getName(), school.getCode(),
                school.getCity(), school.isActive(), primaryAdmin.getCustomId(), primaryAdmin.getEmail());
    }

    @Transactional(readOnly = true)
    public List<SchoolSummary> listSchools() {
        return schools.findAll().stream().map(school -> new SchoolSummary(
                school.getId(), school.getName(), school.getCode(), school.getCity(), school.isActive()))
                .toList();
    }

    @Transactional
    public MemberCreated createMember(CreateMemberRequest request) {
        Long schoolId = TenantContext.requireSchoolId();
        School school = schools.findByIdAndActiveTrue(schoolId)
                .orElseThrow(() -> new EntityNotFoundException("School not found or inactive."));
        String email = request.email().trim().toLowerCase();
        SchoolIdSequence.MemberRole sequenceRole = request.parsedRole();
        String customId = ids.nextId(schoolId, sequenceRole);
        String hashedPassword = passwordEncoder.encode(request.password());
        if (sequenceRole == SchoolIdSequence.MemberRole.TEACHER) {
            Teacher teacher = new Teacher();
            teacher.employeeId = customId;
            teacher.name = request.name().trim();
            teacher.email = email;
            teacher.phone = request.phone();
            teacher.subject = request.subject();
            teacher.className = request.className();
            teacher.setSchool(school);
            Teacher saved = teachers.save(teacher);
            UserAccount account = accounts.save(new UserAccount(customId, customId, email,
                    hashedPassword, UserAccount.Role.TEACHER, request.name().trim(), school, saved, null));
            return new MemberCreated(account.getCustomId(), account.getRole(), request.name().trim(), email);
        }
        if (sequenceRole == SchoolIdSequence.MemberRole.STUDENT) {
            Student student = new Student();
            student.admissionNo = customId;
            student.name = request.name().trim();
            student.email = email;
            student.className = request.className();
            student.section = request.section();
            student.parentName = request.parentName();
            student.parentPhone = request.parentPhone();
            student.setSchool(school);
            Student saved = students.save(student);
            UserAccount account = accounts.save(new UserAccount(customId, customId, email,
                    hashedPassword, UserAccount.Role.STUDENT, request.name().trim(), school, null, saved));
            return new MemberCreated(account.getCustomId(), account.getRole(), request.name().trim(), email);
        }
        throw new AccessDeniedException("School admins can only onboard teachers and students.");
    }

    @Transactional(readOnly = true)
    public List<MemberSummary> listMembers() {
        TenantContext.requireSchoolId();
        List<MemberSummary> members = new java.util.ArrayList<>();
        teachers.findAll().forEach(teacher -> members.add(new MemberSummary(
                teacher.employeeId, "TEACHER", teacher.name, teacher.email, teacher.subject, teacher.className)));
        students.findAll().forEach(student -> members.add(new MemberSummary(
                student.admissionNo, "STUDENT", student.name, student.email, null, student.className)));
        return members.stream().sorted(java.util.Comparator.comparing(MemberSummary::customId)).toList();
    }

    private void seedSchoolMenus(School school) {
        menus.save(createMenu(school, "Dashboard", "/", "⌂", "Operations", 0,
                Set.of("ADMIN", "TEACHER", "STUDENT")));
        menus.save(createMenu(school, "Students", "/students", "♙", "Students", 1, Set.of("ADMIN", "TEACHER")));
        menus.save(createMenu(school, "Attendance", "/attendance", "✓", "Academics", 2,
                Set.of("ADMIN", "TEACHER", "STUDENT")));
        menus.save(createMenu(school, "Examinations", "/exams", "▣", "Academics", 3,
                Set.of("ADMIN", "TEACHER", "STUDENT")));
        menus.save(createMenu(school, "Exam Papers", "/exam-papers", "▤", "Academics", 4, Set.of("ADMIN", "TEACHER")));
        menus.save(createMenu(school, "Fees", "/fees", "₹", "Finance", 5, Set.of("ADMIN", "STUDENT")));
        menus.save(createMenu(school, "Menu Management", "/menu-management", "⚙", "Admin", 6, Set.of("ADMIN")));
    }

    private Menu createMenu(School school, String title, String route, String icon, String category, int order,
                            Set<String> roles) {
        Menu menu = new Menu();
        menu.title = title;
        menu.route = route;
        menu.icon = icon;
        menu.category = category;
        menu.displayOrder = order;
        menu.active = true;
        menu.roles = roles;
        menu.setSchool(school);
        return menu;
    }

    public record CreateSchoolRequest(
            @NotBlank @Size(max = 120) String schoolName,
            @NotBlank @Pattern(regexp = "[A-Za-z0-9]{2,12}") String schoolCode,
            @NotBlank @Size(max = 120) String city,
            @NotBlank @Size(max = 120) String adminName,
            @NotBlank @Email @Size(max = 191) String adminEmail,
            @NotBlank @Size(min = 12, max = 72) String adminPassword) {}

    public record CreateMemberRequest(
            @NotBlank @Size(max = 120) String name,
            @Email @NotBlank @Size(max = 191) String email,
            @NotBlank @Size(min = 12, max = 72) String password,
            @NotBlank String role,
            String phone,
            String subject,
            @NotBlank String className,
            String section,
            String parentName,
            String parentPhone) {
        public SchoolIdSequence.MemberRole parsedRole() {
            try {
                return SchoolIdSequence.MemberRole.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Role must be TEACHER or STUDENT.");
            }
        }
    }

    public record SchoolCreated(Long schoolId, String schoolName, String schoolCode, String city, boolean active,
                                String adminCustomId, String adminEmail) {}
    public record SchoolSummary(Long schoolId, String schoolName, String schoolCode, String city, boolean active) {}
    public record MemberCreated(String customId, UserAccount.Role role, String name, String email) {}
    public record MemberSummary(String customId, String role, String name, String email, String subject, String className) {}
}
