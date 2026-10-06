package com.eduflow.leave;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.concurrent.ThreadLocalRandom;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:leave-workflow;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.security.jwt.secret=VGhpc0lzQVN1aXRhYmxlQmFzZTY0S2V5Rm9ySm9zZUdva25IUzI1NlNpZ25pbmc=",
        "app.bootstrap-super-admin.username=platform@example.com",
        "app.bootstrap-super-admin.password=Super-Admin-Password-123"
})
class LeaveWorkflowIntegrationTest {
    private static final String SUPER_ADMIN_PASSWORD = "Super-Admin-Password-123";
    private static final String ADMIN_PASSWORD = "School8!";
    private static final String TEACHER_PASSWORD = "Teacher-Password-123";

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void teacherSubmitsAndAdminApprovesLeaveWithinSchool() throws Exception {
        String suffix = Integer.toHexString(ThreadLocalRandom.current().nextInt(0x100000, 0xFFFFFF));
        String schoolAdminEmail = "admin-" + suffix + "@example.com";
        String teacherEmail = "teacher-" + suffix + "@example.com";
        String superAdminToken = signIn("platform@example.com", SUPER_ADMIN_PASSWORD);

        MvcResult schoolResult = mockMvc.perform(post("/api/v1/super-admin/schools")
                        .header("Authorization", bearer(superAdminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateSchool(
                                "Test School " + suffix, "S" + suffix.toUpperCase(), "Test City",
                                "Test Admin", schoolAdminEmail, ADMIN_PASSWORD))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.adminCustomId").exists())
                .andReturn();
        String adminCustomId = objectMapper.readTree(schoolResult.getResponse().getContentAsString())
                .get("adminCustomId").asText();
        String adminToken = signIn(adminCustomId, ADMIN_PASSWORD);

        MvcResult memberResult = mockMvc.perform(post("/api/v1/admin/members")
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateMember(
                                "Priya Sharma", teacherEmail, TEACHER_PASSWORD,
                                "TEACHER", "555-0123", "Mathematics", "Class X-A"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customId").value("S" + suffix.toUpperCase() + "-TCH-1001"))
                .andReturn();
        String teacherCustomId = objectMapper.readTree(memberResult.getResponse().getContentAsString())
                .get("customId").asText();
        String teacherToken = signIn(teacherCustomId, TEACHER_PASSWORD);

        mockMvc.perform(get("/api/leaves/admin")
                        .header("Authorization", bearer(teacherToken)))
                .andExpect(status().isForbidden());

        MvcResult submitted = mockMvc.perform(post("/api/leaves")
                        .header("Authorization", bearer(teacherToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"type":"SICK","startDate":"2026-11-02","endDate":"2026-11-03",
                                 "reason":"Medical appointment"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.days", is(2)))
                .andReturn();
        long leaveId = objectMapper.readTree(submitted.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(get("/api/leaves/admin")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].teacherName", is("Priya Sharma")));

        mockMvc.perform(post("/api/leaves/{id}/approve", leaveId)
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"note\":\"Coverage arranged\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")))
                .andExpect(jsonPath("$.reviewedBy", is(adminCustomId)));

        mockMvc.perform(get("/api/leaves/mine")
                        .header("Authorization", bearer(teacherToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("APPROVED")))
                .andExpect(jsonPath("$[0].reviewNote", is("Coverage arranged")));
    }

    @Test
    void apiRejectsUnauthenticatedLeaveAccess() throws Exception {
        mockMvc.perform(get("/api/leaves/mine"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void teacherCanSignInUsingGeneratedEmployeeIdWhenAccountWasCreatedWithEmailUsername() throws Exception {
        String suffix = Integer.toHexString(ThreadLocalRandom.current().nextInt(0x100000, 0xFFFFFF));
        String superAdminToken = signIn("platform@example.com", SUPER_ADMIN_PASSWORD);
        String adminId = createSchool(superAdminToken, "C" + suffix, "admin-" + suffix + "@example.com");
        String adminToken = signIn(adminId, ADMIN_PASSWORD);
        String email = "teacher-" + suffix + "@example.com";

        MvcResult teacherResponse = mockMvc.perform(post("/api/teachers")
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"employeeId":"temporary","name":"Test Teacher","subject":"Physics","className":"X",
                                 "phone":"555-0199","email":"%s"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode teacher = objectMapper.readTree(teacherResponse.getResponse().getContentAsString());
        String employeeId = teacher.get("employeeId").asText();
        long teacherId = teacher.get("id").asLong();

        mockMvc.perform(post("/api/teachers/{id}/account", teacherId)
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new CreateTeacherAccount(email, TEACHER_PASSWORD))))
                .andExpect(status().isCreated());

        JsonNode teacherLogin = login(employeeId, TEACHER_PASSWORD);
        org.assertj.core.api.Assertions.assertThat(teacherLogin.get("customId").asText())
                .isEqualTo(employeeId);
    }

    @Test
    void tenantAdminsCannotListOrReadAnotherSchoolsTeacher() throws Exception {
        String suffix = Integer.toHexString(ThreadLocalRandom.current().nextInt(0x100000, 0xFFFFFF));
        String superAdminToken = signIn("platform@example.com", SUPER_ADMIN_PASSWORD);
        String adminOne = createSchool(superAdminToken, "A" + suffix, "one-" + suffix + "@example.com");
        String adminTwo = createSchool(superAdminToken, "B" + suffix, "two-" + suffix + "@example.com");
        String adminOneToken = signIn(adminOne, ADMIN_PASSWORD);
        JsonNode adminTwoLogin = login(adminTwo, ADMIN_PASSWORD);
        String adminTwoToken = adminTwoLogin.get("accessToken").asText();
        long schoolTwoId = adminTwoLogin.get("schoolId").asLong();

        mockMvc.perform(post("/api/v1/admin/members")
                        .header("Authorization", bearer(adminTwoToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateMember(
                                "Another School Teacher", "teacher-" + suffix + "@example.com",
                                TEACHER_PASSWORD, "TEACHER", "555-0100", "Science", "Class IX"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customId").value("B" + suffix.toUpperCase() + "-TCH-1001"));

        MvcResult studentResponse = mockMvc.perform(post("/api/v1/admin/members")
                        .header("Authorization", bearer(adminTwoToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateMember(
                                "School Two Student", "student-" + suffix + "@example.com",
                                TEACHER_PASSWORD, "STUDENT", "555-0101", "", "Class VII"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customId").value("B" + suffix.toUpperCase() + "-STD-2001"))
                .andReturn();

        mockMvc.perform(get("/api/teachers").header("Authorization", bearer(adminOneToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
        MvcResult teachersResult = mockMvc.perform(get("/api/teachers")
                        .header("Authorization", bearer(adminTwoToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeId")
                        .value("B" + suffix.toUpperCase() + "-TCH-1001"))
                .andReturn();
        long otherSchoolTeacherId = objectMapper.readTree(teachersResult.getResponse().getContentAsString())
                .get(0).get("id").asLong();
        mockMvc.perform(get("/api/teachers/{id}", otherSchoolTeacherId)
                        .header("Authorization", bearer(adminOneToken)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/students").header("Authorization", bearer(adminOneToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
        mockMvc.perform(get("/api/students").header("Authorization", bearer(adminTwoToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].admissionNo")
                        .value("B" + suffix.toUpperCase() + "-STD-2001"));

        String studentCustomId = objectMapper.readTree(studentResponse.getResponse().getContentAsString())
                .get("customId").asText();
        JsonNode studentLogin = login(studentCustomId, TEACHER_PASSWORD);
        String studentToken = studentLogin.get("accessToken").asText();
        org.assertj.core.api.Assertions.assertThat(studentLogin.get("role").asText()).isEqualTo("STUDENT");
        org.assertj.core.api.Assertions.assertThat(studentLogin.get("schoolId").asLong()).isEqualTo(schoolTwoId);
        mockMvc.perform(get("/api/v1/auth/me").header("Authorization", bearer(studentToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customId").value(studentCustomId))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.schoolId").value(schoolTwoId));
        mockMvc.perform(get("/api/students").header("Authorization", bearer(studentToken)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/super-admin/schools").header("Authorization", bearer(adminOneToken)))
                .andExpect(status().isForbidden());
    }

    private String createSchool(String superAdminToken, String code, String adminEmail) throws Exception {
        MvcResult response = mockMvc.perform(post("/api/v1/super-admin/schools")
                        .header("Authorization", bearer(superAdminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateSchool(
                                "School " + code, code, "Test City", "School Admin",
                                adminEmail, ADMIN_PASSWORD))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(response.getResponse().getContentAsString())
                .get("adminCustomId").asText();
    }

    private String signIn(String identifier, String password) throws Exception {
        return login(identifier, password).get("accessToken").asText();
    }

    private JsonNode login(String identifier, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(identifier, password))))
                .andReturn();
        if (result.getResponse().getStatus() != 200) {
            throw new AssertionError("Login failed: " + result.getResponse().getStatus() + " "
                    + result.getResponse().getContentAsString());
        }
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    private record LoginRequest(String identifier, String password) {}
    private record CreateSchool(String schoolName, String schoolCode, String city,
                                String adminName, String adminEmail, String adminPassword) {}
    private record CreateMember(String name, String email, String password, String role,
                                String phone, String subject, String className) {}
    private record CreateTeacherAccount(String username, String password) {}
}
