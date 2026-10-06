CREATE TABLE schools (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(12) NOT NULL,
    city VARCHAR(120),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_schools PRIMARY KEY (id),
    CONSTRAINT uk_school_code UNIQUE (code)
);

CREATE TABLE school_id_sequences (
    id BIGINT NOT NULL AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    role VARCHAR(16) NOT NULL,
    next_value BIGINT NOT NULL,
    CONSTRAINT pk_school_id_sequences PRIMARY KEY (id),
    CONSTRAINT uk_school_sequence_role UNIQUE (school_id, role),
    CONSTRAINT ck_school_sequence_role CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    CONSTRAINT ck_school_sequence_next_value CHECK (next_value > 0),
    CONSTRAINT fk_school_sequence_school FOREIGN KEY (school_id) REFERENCES schools (id)
);

CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(191) NOT NULL,
    custom_id VARCHAR(32) NOT NULL,
    email VARCHAR(191),
    display_name VARCHAR(120),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    teacher_id BIGINT,
    student_id BIGINT,
    school_id BIGINT,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_custom_id UNIQUE (custom_id),
    CONSTRAINT uk_users_teacher UNIQUE (teacher_id),
    CONSTRAINT uk_users_student UNIQUE (student_id),
    CONSTRAINT ck_users_role CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT')),
    CONSTRAINT ck_users_school_role CHECK (
        (role = 'SUPER_ADMIN' AND school_id IS NULL)
        OR (role IN ('ADMIN', 'TEACHER', 'STUDENT') AND school_id IS NOT NULL)
    ),
    CONSTRAINT ck_users_profile_role CHECK (
        (role = 'TEACHER' AND teacher_id IS NOT NULL AND student_id IS NULL)
        OR (role = 'STUDENT' AND student_id IS NOT NULL AND teacher_id IS NULL)
        OR (role IN ('SUPER_ADMIN', 'ADMIN') AND teacher_id IS NULL AND student_id IS NULL)
    ),
    CONSTRAINT fk_users_school FOREIGN KEY (school_id) REFERENCES schools (id)
);

CREATE INDEX idx_user_school_role ON users (school_id, role);
