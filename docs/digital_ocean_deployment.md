# Deployment Guide: TurboNotes on Digital Ocean

This guide outlines the most effective strategies for deploying the TurboNotes monorepo to Digital Ocean, prioritizing the **App Platform** for its ease of use and automated CI/CD capabilities.

## Strategy 1: D.O. App Platform (Recommended)

App Platform is a managed solution (PaaS) that connects directly to your repository (GitHub/GitLab) and auto-deploys on every push. It natively supports monorepos and Docker.

### 1. Preparation
- Ensure your `Dockerfile` for both Backend and Frontend are production-ready.
- **Frontend**: Check that `NEXT_PUBLIC_API_URL` is used for client-side requests.
- **Backend**: Ensure `ALLOWED_HOSTS` includes your production domain (or `${APP_DOMAIN}` provided by DO).

### 2. Create the App
1. Go to **Apps** -> **Create App**.
2. **Service Provider**: Select GitHub/GitLab and choose your `turbonotes` repository.
3. **Monorepo Setup**: App Platform will try to detect services. You may need to edit them manually to define the separate resources (Backend, Frontend, Database, Migration Job).

### 3. Resource Configuration

#### A. Database (PostgreSQL)
- Add a **Database** component.
- Choose **Dev Database** (for low cost) or **Managed PostgreSQL** (for production reliability).
- **Name**: `db` (or similar).

#### B. Backend Service (Django)
- **Source Directory**: `backend`
- **Type**: **Service** (Web Service)
- **Docker**: Select "Dockerfile" if not auto-selected. Path: `Dockerfile`.
- **HTTP Port**: `8000`
- **Environment Variables**:
    - `DJANGO_SECRET_KEY`: *[Generate a strong key]*
    - `DEBUG`: `False`
    - `DATABASE_URL`: *[Link to the Database component you created]*
    - `ALLOWED_HOSTS`: `${APP_DOMAIN}` (Magic variable from DO)
- **Run Command**: Ensure gunicorn is running (usually defined in Dockerfile CMD).

#### C. Migration Job (Critical)
- **Source Directory**: `backend`
- **Type**: **Job** (Pre-deploy)
- **Hook**: "Pre-deploy" (Runs before the web service goes live to ensure DB is ready).
- **Docker**: Same `Dockerfile` as backend.
- **Run Command**: `python manage.py migrate`
- **Environment Variables**:
    - `DATABASE_URL`: *[Link to Database]*
    - `DJANGO_SECRET_KEY`: *[Same as backend]*

#### D. Frontend Service (Next.js)
- **Source Directory**: `frontend`
- **Type**: **Service** (Web Service)
- **Docker**: Select "Dockerfile". Path: `Dockerfile`.
- **HTTP Port**: `3000`
- **Environment Variables** (Available at Runtime & Build time):
    - `NEXT_PUBLIC_API_URL`: *[URL of your Backend Service]* (e.g., `https://sea-lion-app-xxxxx.ondigitalocean.app/api`)
    - **Note**: You might need to deploy the backend first to get the URL, or use a custom domain.

### 4. Deploy
- Click **Next** -> **Create Resources**.
- The build process will start. The `Pre-deploy` migration job will run first. Once successful, the Backend and Frontend services will spin up.

---

## Strategy 2: Droplet with Docker Compose (Custom/Cheaper)

If you prefer full control or have a fixed budget ($4-6/mo), use a Droplet.

### 1. Provision Server
- Create a Basic Droplet (Ubuntu 24.04). 
- Select "Docker" from the Marketplace images to save setup time.

### 2. Deployment
1. **SSH into server**: `ssh root@<droplet-ip>`
2. **Clone Repository**:
   ```bash
   git clone https://github.com/your/repo.git app
   cd app
   ```
3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   # Backend
   DEBUG=0
   SECRET_KEY=...
   DATABASE_URL=postgres://user:pass@db:5432/turbonotes
   
   # Frontend
   NEXT_PUBLIC_API_URL=https://<your-droplet-ip-or-domain>/api
   ```
4. **Run Application**:
   ```bash
   docker compose up -d --build
   ```

### 3. Production Tweaks (Recommended)
- **Reverse Proxy**: Use **Nginx** or **Caddy** to handle SSL (HTTPS) and routing.
    - Route `/api/*` -> `localhost:8000`
    - Route `/*` -> `localhost:3000`
- **SSL**: generating certificates with Let's Encrypt is crucial for security.
- **Database Persistence**: Ensure your `docker-compose.yml` mounts a volume for Postgres data (`- ./postgres_data:/var/lib/postgresql/data`) to prevent data loss on restarts.
