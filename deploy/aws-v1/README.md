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

- build the frontend with `npm ci --no-audit --no-fund --progress=false && npm run build`
- package the backend with `MAVEN_OPTS=-Xmx512m ./mvnw clean package -DskipTests`
- copy the frontend to `/var/www/ufvbay`
- copy the backend jar to `/opt/ufvbay/demo.jar`
- install the systemd unit
- install the Nginx site only if it does not already exist
- restart Nginx and the backend

If you want to replace the live Nginx site with the repo bootstrap config, run:

```bash
deploy/aws-v1/scripts/deploy_app.sh --refresh-nginx-config
```

Use that flag for the initial domain bootstrap. Do not use it on normal redeploys after Certbot has updated the live Nginx file for HTTPS.

## 6. Add a Domain and HTTPS

This repo ships a bootstrap Nginx config for:

- `ufvbay.dev`
- `www.ufvbay.dev`

Before requesting a certificate:

1. Allocate and associate an Elastic IP to the EC2 instance.
2. Open inbound port `443` on the instance security group.
3. Point DNS at the Elastic IP.
4. Run the bootstrap config once:

```bash
deploy/aws-v1/scripts/deploy_app.sh --refresh-nginx-config
```

If you use Namecheap as the active DNS provider, create:

- an `A` record for `@` -> `<Elastic IP>`
- a `CNAME` record for `www` -> `ufvbay.dev`

Verify DNS resolution before requesting the certificate:

```bash
dig +short ufvbay.dev
dig +short www.ufvbay.dev
curl -I http://ufvbay.dev
curl -I http://www.ufvbay.dev
```

Install Certbot and request the certificate:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ufvbay.dev -d www.ufvbay.dev
sudo certbot renew --dry-run
```

Choose the redirect option in Certbot so HTTP redirects to HTTPS. After Certbot updates the live Nginx file, future app redeploys should use the normal command without `--refresh-nginx-config`.

## 7. Verify

Open the EC2 public IP in the browser and verify:

- `/` loads the SPA
- `/login` and `/signup` work
- registration inserts a user in Postgres
- login succeeds and protected listing routes work
- creating a listing uploads to Cloudinary
- refreshing `/login`, `/signup`, `/account`, and `/item/:id` still serves the SPA

If the domain and certificate are configured, also verify:

- `https://ufvbay.dev` serves the app
- `https://www.ufvbay.dev` redirects to `https://ufvbay.dev`
- `http://ufvbay.dev` redirects to HTTPS
- `http://www.ufvbay.dev` redirects to HTTPS

## Manual Service Commands

```bash
sudo systemctl daemon-reload
sudo systemctl enable ufvbay
sudo systemctl restart ufvbay
sudo systemctl status ufvbay

sudo nginx -t
sudo systemctl restart nginx
```
