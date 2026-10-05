# School Management API

Set the MySQL password in `src/main/resources/application.yml`, then run `mvn spring-boot:run`.

Endpoints: `GET/POST /api/menus`, `GET /api/menus/my-access?role=TEACHER`, `GET/POST /api/exam-papers`, and `POST /api/exam-papers/{id}/approve?adminId=1`.

The printable endpoint only returns papers with `APPROVED` status. Add Spring Security + JWT before production deployment.
