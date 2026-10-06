package com.eduflow.student;

import jakarta.persistence.EntityNotFoundException;
import com.eduflow.school.SchoolIdGenerator;
import com.eduflow.school.SchoolIdSequence;
import com.eduflow.tenant.TenantContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository repo;
    private final SchoolIdGenerator ids;

    public StudentService(StudentRepository repo, SchoolIdGenerator ids) {
        this.repo = repo;
        this.ids = ids;
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
        student.admissionNo = ids.nextId(TenantContext.requireSchoolId(), SchoolIdSequence.MemberRole.STUDENT);
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
        existing.dateOfBirth = incoming.dateOfBirth != null ? incoming.dateOfBirth : existing.dateOfBirth;
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
