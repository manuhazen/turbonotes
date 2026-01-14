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

## 12. Frontend Tweaks: Login Error, Mobile Drawer, Save Shortcut
**Date**: 2026-01-14
**Action**: Implemented login error component, mobile sidebar drawer, and save shortcut.
**Prompt/Context**:
> - Error message when the user put bad credentials and cannot login (like bad password)
> - We need to make this app more responsive for mobiles, the sidebar should be on a Drawer by shadcnui (npx shadcn@latest add drawer) and put everything there
> - Enter a control + enter in the notes to save it, also we can put a hint for the user to know if the user hit control + enter he can save the note.

**Execution**:
- **Login**: Added `Alert` component to `sign-in/client.tsx` to display API errors.
- **Mobile**: Refactored `components/sidebar.tsx` to use `Drawer` (shadcn) on mobile (md:hidden) and fixed sidebar on desktop.
- **Shortcuts**: Added `CTRL/CMD + Enter` handler in `note/[id]/client.tsx` and a visual hint.

## 13. Empty State Implementation
**Date**: 2026-01-14
**Action**: Implemented Bobba empty state.
**Prompt/Context**:
> For the empty state of the app, we need the bobba and a cool copy centered:
> <bobba image/> <I’m just here waiting for your charming notes.../>

**Execution**:
- Updated `components/notes-list.tsx` to show `/bobba.png` and the requested text when no notes are found.

## 14. Categories Empty State Copy
**Date**: 2026-01-14
**Action**: Updated categories empty state copy.
**Prompt/Context**:
> And let's improve the categories empty state of copy with a more charm copy as the empty state.

**Execution**:
- Changed "No categories." to "No flavors mixed yet." in `components/sidebar.tsx`.

## 16. PWA & Favicon Implementation
**Date**: 2026-01-14
**Action**: Generated icons and configured PWA manifest.
**Prompt/Context**:
> We need to address something, I want to add a favicon for the page and also prepare the icons to make this app offline in advance... Let's use the bobba image.

**Execution**:
- Created `manifest.json`.
- Generated `favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` from `bobba.png`.
- Updated `app/layout.tsx` metadata.
