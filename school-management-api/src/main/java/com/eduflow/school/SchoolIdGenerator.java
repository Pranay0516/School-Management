package com.eduflow.school;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.Map;

@Service
public class SchoolIdGenerator {
    private static final Map<SchoolIdSequence.MemberRole, Long> STARTS = new EnumMap<>(SchoolIdSequence.MemberRole.class);
    private static final Map<SchoolIdSequence.MemberRole, String> PREFIXES = new EnumMap<>(SchoolIdSequence.MemberRole.class);

    static {
        STARTS.put(SchoolIdSequence.MemberRole.ADMIN, 1L);
        STARTS.put(SchoolIdSequence.MemberRole.TEACHER, 1001L);
        STARTS.put(SchoolIdSequence.MemberRole.STUDENT, 2001L);
        PREFIXES.put(SchoolIdSequence.MemberRole.ADMIN, "ADM");
        PREFIXES.put(SchoolIdSequence.MemberRole.TEACHER, "TCH");
        PREFIXES.put(SchoolIdSequence.MemberRole.STUDENT, "STD");
    }

    private final SchoolIdSequenceRepository sequences;

    public SchoolIdGenerator(SchoolIdSequenceRepository sequences) {
        this.sequences = sequences;
    }

    @Transactional
    public String nextId(Long schoolId, SchoolIdSequence.MemberRole role) {
        SchoolIdSequence sequence = sequences.findForUpdate(schoolId, role)
                .orElseThrow(() -> new EntityNotFoundException(
                        "ID sequence is not initialized for school " + schoolId + " and role " + role));
        long value = sequence.takeNextValue();
        return sequence.getSchool().getCode() + "-" + PREFIXES.get(role) + "-" + String.format("%04d", value);
    }

    public static long initialValue(SchoolIdSequence.MemberRole role) {
        return STARTS.get(role);
    }
}
