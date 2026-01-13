# Prompts Log

## 1. Project Initialization
**Date**: 2026-01-12
**Action**: Initialized monorepo structure, git repository, and documentation folder.
**Prompt/Context**:
> First, we need to setup a mono-repo with the backend and the frontend on this project using Django and Nextjs.
> For every step: We want to save all the prompts after his successful execution in a docs folder a root level

**Execution**:
- Created `backend`, `frontend`, `docs` directories.
- Initialized `git` repository.
- Created this log file.

## 2. Backend Setup
**Action**: Set up Django backend environment and project.
**Prompt/Context**:
> We need to setup a mono-repo with the backend...
> Backend (Django): Create directory, setup env, install Django/DRF, init project.

**Execution**:
- Created virtual environment (`venv`) in `backend/`.
- Installed: `django`, `djangorestframework`, `psycopg2-binary`, `gunicorn`.
- Initialized Django project `config` in `backend/`.

## 3. Frontend Setup
**Action**: Set up Next.js frontend.
**Prompt/Context**:
> Frontend Setup (Next.js): Create directory, initialize Next.js app.

**Execution**:
- Used `npx create-next-app@latest frontend --use-npm --yes`.
- This installs latest Next.js, React, Tailwind CSS, TypeScript, ESLint.

## 4. Docker Setup
**Action**: Created Docker configuration for Backend, Frontend, and Database.
**Prompt/Context**:
> Setup a Docker to boot the application to work in local...

**Execution**:
- **Backend**: `Dockerfile` using Python 3.12, installs requirements, runs Gunicorn.
- **Frontend**: `Dockerfile` using Node 20, builds and runs Next.js.
- **Compose**: `docker-compose.yml` orchestrating Backend, Frontend, and Postgres DB.

## 5. Deployment Setup
**Action**: Prepared Digital Ocean deployment guide.
**Prompt/Context**:
> ...and after deploy the app to the production place (preferly Digital Ocean)

**Execution**:
- Created `docs/digital_ocean_deployment.md` with instructions for App Platform and Droplet.
- Reviewed `docker-compose.yml` for production compatibility.
