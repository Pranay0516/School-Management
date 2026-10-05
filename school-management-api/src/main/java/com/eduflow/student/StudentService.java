package com.eduflow.student;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> findAll(String search) {
        if (search != null && !search.isBlank()) {
            return repo.findByNameContainingIgnoreCaseOrAdmissionNoContainingIgnoreCase(search, search);
        }
        return repo.findAll();
    }

    public Student findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + id));
    }

    @Transactional
    public Student create(Student student) {
        if (repo.existsByAdmissionNo(student.admissionNo)) {
            throw new IllegalArgumentException("Admission number already exists: " + student.admissionNo);
        }
        if (student.status == null || student.status.isBlank()) {
            student.status = "ACTIVE";
        }
        return repo.save(student);
    }

    @Transactional
    public Student update(Long id, Student incoming) {
        Student existing = findById(id);
        existing.name        = incoming.name;
        existing.className   = incoming.className;
        existing.section     = incoming.section;
        existing.parentName  = incoming.parentName;
        existing.parentPhone = incoming.parentPhone;
        existing.status      = incoming.status != null ? incoming.status : existing.status;
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Student not found: " + id);
        }
        repo.deleteById(id);
    }

    public long countActive() {
        return repo.countByStatus("ACTIVE");
    }
}
