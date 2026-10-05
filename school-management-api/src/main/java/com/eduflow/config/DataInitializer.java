package com.eduflow.config;

import com.eduflow.exam.ExamPaper;
import com.eduflow.exam.ExamPaper.Status;
import com.eduflow.exam.ExamPaperRepository;
import com.eduflow.menu.Menu;
import com.eduflow.menu.MenuRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DataInitializer {

    private final MenuRepository menuRepository;
    private final ExamPaperRepository examPaperRepository;

    public DataInitializer(MenuRepository menuRepository, ExamPaperRepository examPaperRepository) {
        this.menuRepository = menuRepository;
        this.examPaperRepository = examPaperRepository;
    }

    @PostConstruct
    public void seedData() {
        if (menuRepository.count() == 0) {
            menuRepository.save(createMenu("Dashboard", "/", "⌂", 0, Set.of("ADMIN", "TEACHER", "STUDENT", "PARENT")));
            menuRepository.save(createMenu("Students", "/students", "♙", 1, Set.of("ADMIN", "TEACHER")));
            menuRepository.save(createMenu("Attendance", "/attendance", "✓", 2, Set.of("ADMIN", "TEACHER", "STUDENT", "PARENT")));
            menuRepository.save(createMenu("Examinations", "/exams", "▣", 3, Set.of("ADMIN", "TEACHER", "STUDENT", "PARENT")));
            menuRepository.save(createMenu("Exam Papers", "/exam-papers", "▤", 4, Set.of("ADMIN", "TEACHER")));
            menuRepository.save(createMenu("Fees", "/fees", "₹", 5, Set.of("ADMIN", "PARENT", "STUDENT")));
            menuRepository.save(createMenu("Menu Management", "/menu-management", "⚙", 6, Set.of("ADMIN")));
        }

        if (examPaperRepository.count() == 0) {
            examPaperRepository.save(createExamPaper("Quarterly Examination", "Mathematics", "Class X-A", 80, 180, Status.PENDING_APPROVAL, 101L));
            examPaperRepository.save(createExamPaper("Unit Test – I", "Science", "Class IX-B", 40, 90, Status.APPROVED, 102L));
        }
    }

    private Menu createMenu(String title, String route, String icon, int order, Set<String> roles) {
        Menu menu = new Menu();
        menu.title = title;
        menu.route = route;
        menu.icon = icon;
        menu.displayOrder = order;
        menu.active = true;
        menu.roles = roles;
        return menu;
    }

    private ExamPaper createExamPaper(String title, String subject, String className, int marks, int duration, Status status, Long createdBy) {
        ExamPaper paper = new ExamPaper();
        paper.title = title;
        paper.subject = subject;
        paper.className = className;
        paper.totalMarks = marks;
        paper.durationMinutes = duration;
        paper.status = status;
        paper.contentJson = "{\"instructions\":\"Answer all questions.\",\"questions\":[\"Q1\",\"Q2\"]}";
        paper.createdBy = createdBy;
        paper.approvedAt = status == Status.APPROVED ? LocalDateTime.now().minusDays(1) : null;
        paper.approvedBy = status == Status.APPROVED ? 1L : null;
        return paper;
    }
}
