# Deployment Guide: TurboNotes on Digital Ocean

This guide covers two methods to deploy the TurboNotes monorepo to Digital Ocean (DO).

## Option 1: Digital Ocean App Platform (Recommended)

App Platform is a PaaS (Platform as a Service) that builds and deploys code directly from your Git repository.

1.  **Push to GitHub/GitLab**: Ensure your code is in a remote repository.
2.  **Create App**:
    - Go to DO Dashboard -> Apps -> Create App.
    - Select your repository.
    - **Monorepo Support**: You will configure two resources (Backend and Frontend) from the same repo.

### Backend Configuration
- **Source Directory**: `backend`
- **Dockerfile Path**: `Dockerfile` (DO will detect it)
- **HTTP Port**: `8000`
- **Environment Variables**:
    - `DJANGO_SECRET_KEY`: (Set a random string)
    - `DEBUG`: `0`
    - `DATABASE_URL`: Add a PostgreSQL component in DO App Platform and link it.

### Frontend Configuration
- **Source Directory**: `frontend`
- **Dockerfile Path**: `Dockerfile`
- **HTTP Port**: `3000`
- **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: URL of your backend app.

## Option 2: Droplet (Docker Compose)

Deploy using a virtual machine (Droplet) with Docker installed.

1.  **Create Droplet**: Ubuntu 22.04 or 24.04 (Docker image available in Marketplace).
2.  **SSH into Droplet**: `ssh root@your_ip`.
3.  **Clone Repo**: `git clone <your_repo_url> .`
4.  **Set Environment**:
    - Create `.env` file with secrets.
5.  **Run**:
    ```bash
    docker compose up -d --build
    ```
6.  **Proxy (Nginx)**: You should set up Nginx to route traffic to ports 3000 and 8000, or use a tool like Nginx Proxy Manager.

## Production Checklist
- [ ] Set `DEBUG=False` in Django.
- [ ] Set `ALLOWED_HOSTS` in Django to your domain.
- [ ] Run `python manage.py migrate` (can be a "Run Command" in App Platform).
- [ ] Run `python manage.py collectstatic` (or serve static files via Whitenoise or Nginx).
