package com.eduflow.examination;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ExaminationService {

    private final ExaminationRepository repo;

    public ExaminationService(ExaminationRepository repo) {
        this.repo = repo;
    }

    public List<Examination> findAll() {
        return repo.findAllByOrderByStartDateAsc();
    }

    public Examination findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Examination not found: " + id));
    }

    @Transactional
    public Examination create(Examination exam) {
        if (exam.status == null || exam.status.isBlank()) {
            exam.status = "SCHEDULED";
        }
        return repo.save(exam);
    }

    @Transactional
    public Examination update(Long id, Examination incoming) {
        Examination existing = findById(id);
        existing.name      = incoming.name;
        existing.className = incoming.className;
        existing.startDate = incoming.startDate;
        existing.endDate   = incoming.endDate;
        existing.status    = incoming.status;
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Examination not found: " + id);
        }
        repo.deleteById(id);
    }
}
