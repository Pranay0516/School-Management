package com.eduflow.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    @EntityGraph(attributePaths = {"teacher", "student", "school"})
    Optional<UserAccount> findByUsernameIgnoreCase(String username);
    @EntityGraph(attributePaths = {"teacher", "student", "school"})
    Optional<UserAccount> findByCustomIdIgnoreCase(String customId);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByTeacher_Id(Long teacherId);

    @EntityGraph(attributePaths = {"teacher", "student", "school"})
    java.util.List<UserAccount> findAllByRole(UserAccount.Role role);
}
