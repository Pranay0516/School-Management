package com.eduflow.leave;

import com.eduflow.auth.UserAccountService;
import com.eduflow.teacher.Teacher;
import com.eduflow.teacher.TeacherRepository;
import com.eduflow.auth.UserAccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

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
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.bootstrap-admin.username=",
        "app.bootstrap-admin.password="
})
class LeaveWorkflowIntegrationTest {

    private static final String ADMIN_PASSWORD = "Admin-Password-123";
    private static final String TEACHER_PASSWORD = "Teacher-Password-123";

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserAccountService accountService;
    @Autowired private UserAccountRepository accounts;
    @Autowired private TeacherRepository teachers;
    @Autowired private LeaveApplicationRepository leaves;

    @BeforeEach
    void clearAccountsAndRequests() {
        leaves.deleteAll();
        accounts.deleteAll();
        teachers.deleteAll();
    }

    @Test
    void teacherSubmitsAndAdminApprovesLeaveWithRoleAndCsrfChecks() throws Exception {
        accountService.createInitialAdmin("admin@example.com", ADMIN_PASSWORD);
        Teacher teacher = new Teacher();
        teacher.employeeId = "T-" + System.nanoTime();
        teacher.name = "Priya Sharma";
        teacher.email = "priya-" + System.nanoTime() + "@example.com";
        teacher = teachers.saveAndFlush(teacher);
        accountService.createTeacherAccount(teacher.id, teacher.email, TEACHER_PASSWORD);

        MockHttpSession teacherSession = signIn(teacher.email, TEACHER_PASSWORD);
        MockHttpSession adminSession = signIn("admin@example.com", ADMIN_PASSWORD);

        mockMvc.perform(get("/api/leaves/admin").session(teacherSession))
                .andExpect(status().isForbidden());

        Csrf csrf = csrfFor(teacherSession);
        String requestBody = objectMapper.writeValueAsString(new LeaveService.CreateLeaveRequest(
                LeaveApplication.LeaveType.SICK,
                java.time.LocalDate.parse("2026-11-02"),
                java.time.LocalDate.parse("2026-11-03"),
                "Medical appointment"));
        MvcResult submission = mockMvc.perform(post("/api/leaves")
                        .session(teacherSession)
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.days", is(2)))
                .andReturn();
        long leaveId = objectMapper.readTree(submission.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(get("/api/leaves/admin").session(adminSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].teacherName", is("Priya Sharma")));

        Csrf adminCsrf = csrfFor(adminSession);
        mockMvc.perform(post("/api/leaves/{id}/approve", leaveId)
                        .session(adminSession)
                        .cookie(adminCsrf.cookie())
                        .header("X-XSRF-TOKEN", adminCsrf.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"note\":\"Coverage arranged\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")))
                .andExpect(jsonPath("$.reviewedBy", is("admin@example.com")));

        mockMvc.perform(get("/api/leaves/mine").session(teacherSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("APPROVED")))
                .andExpect(jsonPath("$[0].reviewNote", is("Coverage arranged")));
    }

    @Test
    void apiRejectsUnauthenticatedLeaveAccess() throws Exception {
        mockMvc.perform(get("/api/leaves/mine"))
                .andExpect(status().isUnauthorized());
    }

    private MockHttpSession signIn(String username, String password) throws Exception {
        Csrf csrf = csrfFor(null);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(username, password))))
                .andExpect(status().isOk())
                .andReturn();
        return (MockHttpSession) result.getRequest().getSession(false);
    }

    private Csrf csrfFor(MockHttpSession session) throws Exception {
        MockHttpServletRequestBuilder request = get("/api/auth/csrf");
        if (session != null) {
            request.session(session);
        }
        MvcResult result = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn();
        String token = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();
        return new Csrf(token, new Cookie("XSRF-TOKEN", token));
    }

    private record LoginRequest(String username, String password) {}
    private record Csrf(String token, Cookie cookie) {}
}
