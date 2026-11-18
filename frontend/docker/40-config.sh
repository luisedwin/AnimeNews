#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-https://backend-ciu5.onrender.com/api}"
envsubst '${API_BASE_URL}' \
  < /etc/nginx/templates/config.js.template \
  > /usr/share/nginx/html/config.js
