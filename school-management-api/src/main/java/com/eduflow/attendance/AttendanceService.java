package com.eduflow.attendance;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository repo;

    public AttendanceService(AttendanceRepository repo) {
        this.repo = repo;
    }

    public List<Attendance> findAll(LocalDate date, String className) {
        if (date != null && className != null && !className.isBlank()) {
            return repo.findByAttendanceDateAndClassName(date, className);
        }
        if (date != null) {
            return repo.findByAttendanceDate(date);
        }
        return repo.findAll();
    }

    @Transactional
    public List<Attendance> saveAll(List<Attendance> records) {
        return repo.saveAll(records);
    }

    public long countPresentToday() {
        return repo.countByAttendanceDateAndStatus(LocalDate.now(), Attendance.AttendanceStatus.PRESENT);
    }
}
