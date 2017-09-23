#!/bin/bash
cp /usr/local/vesta/nginx/vesta-nginx.service /lib/systemd/system/vesta-nginx.service
chmod 664 /lib/systemd/system/vesta-nginx.service
systemctl daemon-reload