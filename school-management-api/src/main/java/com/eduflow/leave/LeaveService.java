package com.eduflow.leave;

import com.eduflow.auth.AccountPrincipal;
import com.eduflow.auth.UserAccount;
import com.eduflow.teacher.Teacher;
import com.eduflow.teacher.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class LeaveService {

    private static final Set<LeaveApplication.Status> DATE_CONFLICT_STATUSES =
            Set.of(LeaveApplication.Status.PENDING, LeaveApplication.Status.APPROVED);

    private final LeaveApplicationRepository leaves;
    private final TeacherRepository teachers;

    public LeaveService(LeaveApplicationRepository leaves, TeacherRepository teachers) {
        this.leaves = leaves;
        this.teachers = teachers;
    }

    public List<LeaveResponse> findMine(AccountPrincipal principal) {
        Long teacherId = requireTeacher(principal).getId();
        return leaves.findByTeacher_IdOrderByCreatedAtDesc(teacherId).stream()
                .map(LeaveResponse::from)
                .toList();
    }

    public List<LeaveResponse> findAllForAdmin() {
        return leaves.findAllByOrderByCreatedAtDesc().stream()
                .map(LeaveResponse::from)
                .toList();
    }

    @Transactional
    public LeaveResponse apply(AccountPrincipal principal, CreateLeaveRequest request) {
        Teacher teacher = requireTeacher(principal);
        if (request.startDate().isAfter(request.endDate())) {
            throw new IllegalArgumentException("The start date must be on or before the end date.");
        }

        Teacher lockedTeacher = teachers.findByIdForUpdate(teacher.getId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher record no longer exists."));
        boolean overlaps = leaves
                .existsByTeacher_IdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        lockedTeacher.getId(),
                        DATE_CONFLICT_STATUSES,
                        request.endDate(),
                        request.startDate());
        if (overlaps) {
            throw new IllegalArgumentException(
                    "These dates overlap another pending or approved leave application.");
        }

        String reason = request.reason().trim();
        if (reason.isEmpty()) {
            throw new IllegalArgumentException("A reason is required.");
        }

        LeaveApplication application = leaves.save(new LeaveApplication(
                lockedTeacher,
                request.type(),
                request.startDate(),
                request.endDate(),
                reason));
        return LeaveResponse.from(application);
    }

    @Transactional
    public LeaveResponse approve(Long id, String reviewer, String note) {
        return decide(id, reviewer, LeaveApplication.Status.APPROVED, note);
    }

    @Transactional
    public LeaveResponse reject(Long id, String reviewer, String note) {
        if (note == null || note.isBlank()) {
            throw new IllegalArgumentException("A reason is required when rejecting a leave request.");
        }
        return decide(id, reviewer, LeaveApplication.Status.REJECTED, note);
    }

    private LeaveResponse decide(
            Long id, String reviewer, LeaveApplication.Status decision, String note) {
        LeaveApplication application = leaves.findByIdForUpdate(id)
                .orElseThrow(() -> new EntityNotFoundException("Leave application not found: " + id));
        if (application.getStatus() != LeaveApplication.Status.PENDING) {
            throw new IllegalArgumentException("Only pending leave applications can be reviewed.");
        }
        String reviewNote = note == null ? null : note.trim();
        if (reviewNote != null && reviewNote.length() > 1000) {
            throw new IllegalArgumentException("The review note must not exceed 1000 characters.");
        }
        application.review(decision, reviewNote, reviewer);
        return LeaveResponse.from(application);
    }

    private static Teacher requireTeacher(AccountPrincipal principal) {
        UserAccount account = principal.account();
        if (account.getRole() != UserAccount.Role.TEACHER || account.getTeacher() == null) {
            throw new IllegalArgumentException("This account is not linked to a teacher record.");
        }
        if (!"ACTIVE".equalsIgnoreCase(account.getTeacher().getStatus())) {
            throw new IllegalArgumentException("Inactive teachers cannot submit leave requests.");
        }
        return account.getTeacher();
    }

    public record CreateLeaveRequest(
            @jakarta.validation.constraints.NotNull LeaveApplication.LeaveType type,
            @jakarta.validation.constraints.NotNull java.time.LocalDate startDate,
            @jakarta.validation.constraints.NotNull java.time.LocalDate endDate,
            @jakarta.validation.constraints.NotBlank
            @jakarta.validation.constraints.Size(max = 1000) String reason) {}

    public record DecisionRequest(
            @jakarta.validation.constraints.Size(max = 1000) String note) {}

    public record RejectRequest(
            @jakarta.validation.constraints.NotBlank
            @jakarta.validation.constraints.Size(max = 1000) String note) {}

    public record LeaveResponse(
            Long id,
            Long teacherId,
            String teacherName,
            String teacherUsername,
            LeaveApplication.LeaveType type,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            long days,
            String reason,
            LeaveApplication.Status status,
            String reviewNote,
            String reviewedBy,
            java.time.LocalDateTime reviewedAt,
            java.time.LocalDateTime createdAt) {

        static LeaveResponse from(LeaveApplication application) {
            Teacher teacher = application.getTeacher();
            return new LeaveResponse(
                    application.getId(),
                    teacher.getId(),
                    teacher.getName(),
                    teacher.getEmail(),
                    application.getType(),
                    application.getStartDate(),
                    application.getEndDate(),
                    ChronoUnit.DAYS.between(application.getStartDate(), application.getEndDate()) + 1,
                    application.getReason(),
                    application.getStatus(),
                    application.getReviewNote(),
                    application.getReviewedBy(),
                    application.getReviewedAt(),
                    application.getCreatedAt());
        }
    }
}
