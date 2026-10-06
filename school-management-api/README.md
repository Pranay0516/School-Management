# School Management API

The API uses MySQL and Spring-managed HTTP sessions. Set the database connection with
`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

## First administrator

Set `APP_BOOTSTRAP_ADMIN_USERNAME` and `APP_BOOTSTRAP_ADMIN_PASSWORD` before the first start.
The password must be at least 12 characters. The account is created once; changing these
environment variables later does not reset an existing password. Do not commit credentials.

For PowerShell development:

```powershell
$env:APP_BOOTSTRAP_ADMIN_USERNAME = "admin@example.com"
$env:APP_BOOTSTRAP_ADMIN_PASSWORD = "<choose-a-unique-password-of-at-least-12-characters>"
mvn spring-boot:run
```

After signing in as admin, create teacher records in the Teachers page and use **Create login**
to provision teacher accounts. Teacher usernames are email addresses and passwords must contain
at least 12 characters.

## Leave workflow

- Teachers sign in and submit leave requests from the Staff App.
- Admins review requests under **Leave Approvals** in the School Portal.
- Dates are inclusive calendar days. A teacher cannot submit overlapping requests while an
  earlier request is pending or approved. Rejections require an administrator note.
- Teachers can only read their own requests; only admins can review requests. Review decisions
  are final.

Leave endpoints: `GET /api/leaves/mine`, `POST /api/leaves`, `GET /api/leaves/admin`,
`POST /api/leaves/{id}/approve`, and `POST /api/leaves/{id}/reject`.
