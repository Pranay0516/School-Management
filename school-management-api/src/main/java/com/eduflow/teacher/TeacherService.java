package com.eduflow.teacher;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TeacherService {

    private final TeacherRepository repo;

    public TeacherService(TeacherRepository repo) {
        this.repo = repo;
    }

    public List<Teacher> findAll(String search) {
        if (search != null && !search.isBlank()) {
            return repo.findByNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(search, search);
        }
        return repo.findAll();
    }

    public Teacher findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found: " + id));
    }

    @Transactional
    public Teacher create(Teacher teacher) {
        if (repo.existsByEmployeeId(teacher.employeeId)) {
            throw new IllegalArgumentException("Employee ID already exists: " + teacher.employeeId);
        }
        if (teacher.status == null || teacher.status.isBlank()) {
            teacher.status = "ACTIVE";
        }
        return repo.save(teacher);
    }

    @Transactional
    public Teacher update(Long id, Teacher incoming) {
        Teacher existing = findById(id);
        existing.name      = incoming.name;
        existing.subject   = incoming.subject;
        existing.className = incoming.className;
        existing.phone     = incoming.phone;
        existing.email     = incoming.email;
        existing.status    = incoming.status != null ? incoming.status : existing.status;
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Teacher not found: " + id);
        }
        repo.deleteById(id);
    }

    public long countActive() {
        return repo.countByStatus("ACTIVE");
    }
}
