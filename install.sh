#!/bin/bash
mkdir -p ./gateway/certs
cd ./gateway/certs
mkcert shortening.local.com "*.shortening.local.com"

if ! grep -q shortening.local.com /etc/hosts; then
    sudo sed -i '/^127\.0\.0\.1\s/s/$/ '"shortening.local.com"'/' /etc/hosts
fi

docker-compose up -d --build