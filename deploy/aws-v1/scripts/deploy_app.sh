#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/client"
BACKEND_DIR="$ROOT_DIR/demo"
DEPLOY_DIR="/opt/ufvbay"
WEB_DIR="/var/www/ufvbay"
SERVICE_FILE="/etc/systemd/system/ufvbay.service"
NGINX_SITE="/etc/nginx/sites-available/ufvbay"

if [[ ! -f /etc/ufvbay/ufvbay.env ]]; then
    echo "Missing /etc/ufvbay/ufvbay.env"
    echo "Copy deploy/aws-v1/ufvbay.env.example and fill in the real values first."
    exit 1
fi

pushd "$FRONTEND_DIR" >/dev/null
npm ci
npm run build
popd >/dev/null

pushd "$BACKEND_DIR" >/dev/null
./mvnw clean package -DskipTests
popd >/dev/null

sudo mkdir -p "$DEPLOY_DIR" "$WEB_DIR"
sudo cp "$BACKEND_DIR"/target/demo-0.0.1-SNAPSHOT.jar "$DEPLOY_DIR"/demo.jar
sudo rm -rf "$WEB_DIR"/*
sudo cp -R "$FRONTEND_DIR"/dist/. "$WEB_DIR"/

sudo cp "$ROOT_DIR"/deploy/aws-v1/systemd/ufvbay.service "$SERVICE_FILE"
sudo cp "$ROOT_DIR"/deploy/aws-v1/nginx/ufvbay.conf "$NGINX_SITE"
sudo ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/ufvbay
sudo rm -f /etc/nginx/sites-enabled/default

sudo systemctl daemon-reload
sudo systemctl enable ufvbay
sudo systemctl restart ufvbay
sudo nginx -t
sudo systemctl restart nginx

echo "Deployment complete."
echo "Backend status:"
sudo systemctl --no-pager --full status ufvbay || true
