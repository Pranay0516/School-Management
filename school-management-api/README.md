# School Management API

Spring Boot API for the shared-database, shared-schema school platform. School-owned entities
carry a `school_id` foreign key; Hibernate applies the authenticated school scope to repository
queries, while entity lifecycle checks reject cross-school loads and writes. The super-admin is
unscoped and has access only to the school provisioning API.

## First startup

Configure a stable 32-byte-or-longer random signing key and one bootstrap super-admin. Do not
commit these values. The super-admin bootstrap is idempotent and refuses to reuse a username
already assigned to a non-super-admin account.

```powershell
$bytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$env:APP_JWT_SECRET = [Convert]::ToBase64String($bytes)
$env:APP_BOOTSTRAP_SUPER_ADMIN_USERNAME = "platform@example.com"
$env:APP_BOOTSTRAP_SUPER_ADMIN_PASSWORD = "<unique-password-of-at-least-12-characters>"

Push-Location .\school-management-api
mvn spring-boot:run
Pop-Location
```

`APP_JWT_SECRET` must remain stable across restarts or outstanding access tokens will stop
validating. Tokens use HS256, include `userId`, `customId`, `role`, and (for school accounts)
`schoolId`, and expire after 30 minutes by default. Override the lifetime with
`APP_JWT_LIFETIME_SECONDS`. All protected API calls use `Authorization: Bearer <token>`.
The Angular app stores the token in tab-scoped `sessionStorage`.

For a persistent MySQL database set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and
`SPRING_DATASOURCE_PASSWORD`. The repository's H2 in-memory database is only a local-development
default. Configure a production schema migration process and use
`SPRING_JPA_HIBERNATE_DDL_AUTO=validate` in production; automatic `update` is retained for the
existing development workflow.

## UAT and production profiles

Activate the Spring profile with `SPRING_PROFILES_ACTIVE=uat` or
`SPRING_PROFILES_ACTIVE=prod`. Both profiles require external database connection values,
the bootstrap super-admin username/password, and a stable `APP_JWT_SECRET`; keep credentials
in the deployment platform's secret store, not in source control. `APP_CORS_ALLOWED_ORIGINS`
can be set to a comma-separated list when the Angular app is hosted on a different origin.
The profiles use `ddl-auto: validate` and disable Open Session in View; apply a complete
schema migration before starting them. The checked-in tenancy DDL is not yet a complete
baseline for every application table, so do not point these profiles at an unmigrated database.

Example profile activation in PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE = "uat"
# Set SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME,
# SPRING_DATASOURCE_PASSWORD, APP_JWT_SECRET, and bootstrap credentials securely.
mvn spring-boot:run
```

## Roles and tenant APIs

| Role | Scope |
| --- | --- |
| `SUPER_ADMIN` | No school. Can register schools and provision the first school admin only. |
| `ADMIN` | One active school. Can list and onboard only that school's teachers and students. |
| `TEACHER` | One school; existing academic and leave operations are school-filtered. |
| `STUDENT` | One school; existing academic operations are school-filtered. |

- `POST /api/v1/auth/login` accepts `{ "identifier": "<custom ID>", "password": "..." }`.
- `GET /api/v1/auth/me` returns the verified token identity.
- `POST /api/v1/super-admin/schools` creates a school, its initial ID sequences, profile,
  school menus, and primary admin in one transaction.
- `GET /api/v1/super-admin/schools` lists registered schools.
- `POST /api/v1/admin/members` creates a `TEACHER` or `STUDENT` record and login account.
- `GET /api/v1/admin/members` lists records belonging to the signed-in admin's school.

School provisioning accepts the school name/code/city and primary admin name/email/password.
The generated admin ID is returned as `adminCustomId`. The email is contact data; the generated
custom ID is the login identifier. Member provisioning uses a reactive role selector and returns
the generated custom ID after creation.

School codes are normalized to uppercase and uniquely constrained. The `school_id_sequences`
table has one row per school/role, a unique `(school_id, role)` constraint, and a pessimistically
locked counter. It starts at 0001 for admins, 1001 for teachers, and 2001 for students. The
resulting IDs are `<CODE>-ADM-0001`, `<CODE>-TCH-1001`, and `<CODE>-STD-2001`.

Dialect-specific core DDL is provided in
[`db/tenancy/mysql.sql`](./src/main/resources/db/tenancy/mysql.sql) and
[`db/tenancy/postgresql.sql`](./src/main/resources/db/tenancy/postgresql.sql). It defines
`schools`, `users`, and `school_id_sequences`, including tenant and role checks, unique IDs/codes,
foreign keys, and the school/role account index. These files are core-schema references, not a
complete baseline migration for every application table. A production migration must also create
the domain tables and their `school_id` foreign keys before setting
`SPRING_JPA_HIBERNATE_DDL_AUTO=validate`.

Every school-owned domain table, including dashboard records, also has a `school_id` foreign key
and Hibernate tenant filter. `SchoolScopedEntity` checks writes and protects direct identifier
loads where SQL filters alone are insufficient.

The new installation does not seed sample schools, admins, or dashboard data. Old application
tables/records are not assigned to a tenant or exposed; they are not automatically deleted. Back
up legacy data before separately removing it from a persistent database.

## Leave workflow

- Teachers sign in and submit leave requests from the Staff App.
- Admins review requests under **Leave Approvals** in the School Portal.
- Dates are inclusive calendar days. A teacher cannot submit overlapping requests while an
  earlier request is pending or approved. Rejections require an administrator note.
- Teachers can only read their own requests; only admins can review requests.

Leave endpoints: `GET /api/leaves/mine`, `POST /api/leaves`, `GET /api/leaves/admin`,
`POST /api/leaves/{id}/approve`, and `POST /api/leaves/{id}/reject`.
