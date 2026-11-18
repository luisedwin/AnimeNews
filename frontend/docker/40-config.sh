#!/bin/sh
set -eu

: "${API_BASE_URL:?API_BASE_URL must be configured}"
envsubst '${API_BASE_URL}' \
  < /etc/nginx/templates/config.js.template \
  > /usr/share/nginx/html/config.js
