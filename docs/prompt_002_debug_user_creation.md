# Debugging 500 Error on User Creation

## Issue
The user reported a 500 error when creating a new user via the API.

## Investigation
- Checked backend logs: `OperationalError: no such table: users_user`.
- This indicated that Django migrations were created but not applied to the actual database volume.

## Solution
Ran the migration command in the backend container:

```bash
docker compose exec backend python manage.py migrate
```

## Verification
- Verified permissions and schema using a shell script.
- Successfully created a test user: `test_fixed@example.com`.
