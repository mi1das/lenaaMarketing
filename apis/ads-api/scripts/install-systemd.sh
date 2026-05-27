#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="lenaa-ads-api.service"
PROJECT_DIR="/home/hermes/.hermes/profiles/lenaamarketing/apis/ads-api"
SERVICE_SRC="$PROJECT_DIR/systemd/$SERVICE_NAME"
SERVICE_DST="/etc/systemd/system/$SERVICE_NAME"

sudo install -o root -g root -m 0644 "$SERVICE_SRC" "$SERVICE_DST"
sudo systemctl daemon-reload
sudo systemctl enable --now "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager
