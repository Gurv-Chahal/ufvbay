#!/usr/bin/env bash

set -euo pipefail

sudo apt-get update
sudo apt-get install -y git curl unzip nginx postgresql postgresql-contrib openjdk-17-jre-headless

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo systemctl enable nginx
sudo systemctl enable postgresql
sudo systemctl start nginx
sudo systemctl start postgresql

echo "Instance dependencies installed."
echo "Next steps:"
echo "1. Create the Postgres database and user."
echo "2. Copy deploy/aws-v1/ufvbay.env.example to /etc/ufvbay/ufvbay.env and fill it in."
echo "3. Run deploy/aws-v1/scripts/deploy_app.sh from the repo root."
