# AWS V1 Deployment

This deployment target is a single Ubuntu EC2 instance running:

- Nginx for static frontend hosting and reverse proxying
- Spring Boot on `localhost:8080`
- PostgreSQL on the same EC2 host

The goal is a cheap first deployment that supports login, registration, listings, and image uploads without CI/CD.

## Runtime Layout

- Frontend files: `/var/www/ufvbay`
- Backend jar: `/opt/ufvbay/demo.jar`
- Backend env file: `/etc/ufvbay/ufvbay.env`
- Systemd unit: `/etc/systemd/system/ufvbay.service`
- Nginx site: `/etc/nginx/sites-available/ufvbay`

## 1. Provision the Instance

- Launch an Ubuntu x86 EC2 instance, `t3.small` by default
- Open inbound ports:
  - `22` for SSH
  - `80` for HTTP

## 2. Prepare the Server

SSH into the EC2 instance and run:

```bash
sudo apt-get update
sudo apt-get install -y git curl unzip nginx postgresql postgresql-contrib openjdk-17-jre-headless
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Or copy and run the helper script in [scripts/setup_instance.sh](scripts/setup_instance.sh).

## 3. Create the Database

```bash
sudo -u postgres psql
```

Inside `psql`:

```sql
CREATE DATABASE ufvbay;
CREATE USER ufvbay_app WITH PASSWORD 'replace_me';
GRANT ALL PRIVILEGES ON DATABASE ufvbay TO ufvbay_app;
\q
```

## 4. Configure Environment Variables

Copy the example env file:

```bash
sudo mkdir -p /etc/ufvbay
sudo cp deploy/aws-v1/ufvbay.env.example /etc/ufvbay/ufvbay.env
sudo chmod 600 /etc/ufvbay/ufvbay.env
```

Edit `/etc/ufvbay/ufvbay.env` and set:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Generate a base64 JWT secret with:

```bash
openssl rand -base64 32
```

## 5. Build and Install the App

Clone the repo on the EC2 instance, then from the repo root run:

```bash
deploy/aws-v1/scripts/deploy_app.sh
```

That script will:

- build the frontend with `npm ci && npm run build`
- package the backend with `./mvnw clean package -DskipTests`
- copy the frontend to `/var/www/ufvbay`
- copy the backend jar to `/opt/ufvbay/demo.jar`
- install the systemd unit
- install the Nginx site
- restart Nginx and the backend

## 6. Verify

Open the EC2 public IP in the browser and verify:

- `/` loads the SPA
- `/login` and `/signup` work
- registration inserts a user in Postgres
- login succeeds and protected listing routes work
- creating a listing uploads to Cloudinary
- refreshing `/login`, `/signup`, `/account`, and `/item/:id` still serves the SPA

## Manual Service Commands

```bash
sudo systemctl daemon-reload
sudo systemctl enable ufvbay
sudo systemctl restart ufvbay
sudo systemctl status ufvbay

sudo nginx -t
sudo systemctl restart nginx
```
