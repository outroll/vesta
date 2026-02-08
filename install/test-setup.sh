#!/bin/bash
#
# Quick Test Setup for Vesta Development
#
# This script sets up just enough to test the web UI
# without running the full Vesta installer.
#
# Usage: sudo ./test-setup.sh
#

set -e

# Check root
if [ "$(id -u)" != "0" ]; then
    echo "This script must be run as root"
    exit 1
fi

echo "=== Vesta Quick Test Setup ==="
echo ""

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
    echo "Detected: $PRETTY_NAME"
else
    echo "Cannot detect OS"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Vesta source: $SCRIPT_DIR"
echo ""

# Install dependencies
echo "Installing dependencies..."
apt-get update -qq
apt-get install -y -qq nginx php-fpm php-cli php-curl php-json php-mbstring

# Determine PHP version
PHP_VERSION=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
echo "PHP version: $PHP_VERSION"

# Copy Vesta files
echo "Copying Vesta files to /usr/local/vesta..."
mkdir -p /usr/local/vesta
cp -r "$SCRIPT_DIR"/* /usr/local/vesta/
chown -R root:root /usr/local/vesta
chmod +x /usr/local/vesta/bin/*

# Configure sudoers for www-data
echo "Configuring sudoers..."
echo "www-data ALL=(ALL) NOPASSWD: /usr/local/vesta/bin/*" > /etc/sudoers.d/vesta-www
chmod 440 /etc/sudoers.d/vesta-www

# Create basic config
echo "Creating basic config..."
mkdir -p /usr/local/vesta/conf
cat > /usr/local/vesta/conf/vesta.conf << 'CONF'
VERSION='2.0.0-dev'
LANGUAGE='en'
WEB_SYSTEM='nginx'
WEB_PORT='8083'
PROXY_SYSTEM=''
DB_SYSTEM='mysql'
MAIL_SYSTEM='exim'
IMAP_SYSTEM='dovecot'
DNS_SYSTEM='bind'
CRON_SYSTEM='cron'
BACKUP_SYSTEM='local'
CONF

# Create nginx config
echo "Configuring nginx..."
cat > /etc/nginx/sites-available/vesta.conf << NGINX
server {
    listen 8083;
    server_name _;

    root /usr/local/vesta/web;
    index index.php index.html;

    location / {
        try_files \$uri \$uri/ /index.php?\$args;
    }

    location ~ \\.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php${PHP_VERSION}-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location /static {
        alias /usr/local/vesta/web/static;
        try_files \$uri \$uri/ /static/index.html;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/vesta.conf /etc/nginx/sites-enabled/

# Restart services
echo "Restarting services..."
systemctl restart php${PHP_VERSION}-fpm
systemctl restart nginx

# Get IP
IP=$(hostname -I | awk '{print $1}')

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Access Vesta at: http://${IP}:8083"
echo ""
echo "Note: This is a minimal test setup."
echo "For full functionality, run the complete installer."
echo ""
