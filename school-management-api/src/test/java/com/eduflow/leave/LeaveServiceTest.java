package com.eduflow.leave;

import com.eduflow.auth.AccountPrincipal;
import com.eduflow.auth.UserAccount;
import com.eduflow.teacher.Teacher;
import com.eduflow.teacher.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveApplicationRepository leaves;

    @Mock
    private TeacherRepository teachers;

    private LeaveService service;
    private Teacher teacher;
    private AccountPrincipal principal;

    @BeforeEach
    void setUp() {
        service = new LeaveService(leaves, teachers);
        teacher = new Teacher();
        teacher.id = 17L;
        teacher.name = "Priya Sharma";
        teacher.email = "priya@example.com";
        UserAccount account = new UserAccount("priya@example.com", "hash", UserAccount.Role.TEACHER, teacher);
        principal = new AccountPrincipal(account);
    }

    @Test
    void rejectsARequestWhoseEndDatePrecedesItsStartDate() {
        LeaveService.CreateLeaveRequest request = request("2026-10-12", "2026-10-10");

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class, () -> service.apply(principal, request));

        assertEquals("The start date must be on or before the end date.", error.getMessage());
        verifyNoInteractions(teachers, leaves);
    }

    @Test
    void rejectsOverlappingPendingOrApprovedLeave() {
        when(teachers.findByIdForUpdate(teacher.id)).thenReturn(Optional.of(teacher));
        when(leaves.existsByTeacher_IdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                teacher.id,
                Set.of(LeaveApplication.Status.PENDING, LeaveApplication.Status.APPROVED),
                LocalDate.parse("2026-10-12"),
                LocalDate.parse("2026-10-10"))).thenReturn(true);

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.apply(principal, request("2026-10-10", "2026-10-12")));

        assertTrue(error.getMessage().contains("overlap"));
        verify(leaves, never()).save(any());
    }

    @Test
    void countsInclusiveCalendarDaysWhenCreatingALeave() {
        when(teachers.findByIdForUpdate(teacher.id)).thenReturn(Optional.of(teacher));
        when(leaves.existsByTeacher_IdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                anyLong(), anySet(), any(LocalDate.class), any(LocalDate.class))).thenReturn(false);
        when(leaves.save(any(LeaveApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LeaveService.LeaveResponse response =
                service.apply(principal, request("2026-10-10", "2026-10-12"));

        assertEquals(3, response.days());
        assertEquals(LeaveApplication.Status.PENDING, response.status());
        assertEquals(teacher.id, response.teacherId());
        assertEquals("Fever and cold", response.reason());
    }

    @Test
    void rejectsARejectionWithoutAnExplanation() {
        assertThrows(IllegalArgumentException.class, () -> service.reject(5L, "admin", " "));
        verifyNoInteractions(leaves);
    }

    @Test
    void willNotReviewAnApplicationMoreThanOnce() {
        LeaveApplication application = new LeaveApplication(
                teacher,
                LeaveApplication.LeaveType.SICK,
                LocalDate.parse("2026-10-10"),
                LocalDate.parse("2026-10-10"),
                "Fever");
        application.review(LeaveApplication.Status.REJECTED, "Please resubmit", "admin@example.com");
        when(leaves.findByIdForUpdate(5L)).thenReturn(Optional.of(application));

        assertThrows(IllegalArgumentException.class, () -> service.approve(5L, "admin", null));
        assertEquals(LeaveApplication.Status.REJECTED, application.getStatus());
    }

    private static LeaveService.CreateLeaveRequest request(String start, String end) {
        return new LeaveService.CreateLeaveRequest(
                LeaveApplication.LeaveType.SICK,
                LocalDate.parse(start),
                LocalDate.parse(end),
                "  Fever and cold  ");
    }
}
