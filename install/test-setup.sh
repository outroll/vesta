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
apt-get install -y -qq nginx php-fpm php-cli php-curl php-json php-mbstring openssl

# Determine PHP version
PHP_VERSION=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
echo "PHP version: $PHP_VERSION"

# Copy Vesta files
echo "Copying Vesta files to /usr/local/vesta..."
mkdir -p /usr/local/vesta
cp -r "$SCRIPT_DIR"/* /usr/local/vesta/
chown -R root:root /usr/local/vesta
chmod +x /usr/local/vesta/bin/*

# Create required directories
echo "Creating required directories..."
mkdir -p /usr/local/vesta/log
mkdir -p /usr/local/vesta/data/users/admin/conf
mkdir -p /usr/local/vesta/data/packages
mkdir -p /usr/local/vesta/data/queue
touch /usr/local/vesta/log/auth.log
chmod 640 /usr/local/vesta/log/auth.log

# Configure sudoers for www-data (IMPORTANT: must include env_keep)
echo "Configuring sudoers..."
cat > /etc/sudoers.d/vesta-www << 'EOF'
www-data ALL=(ALL) NOPASSWD: /usr/local/vesta/bin/*
Defaults:www-data env_keep += "VESTA"
EOF
chmod 440 /etc/sudoers.d/vesta-www

# Create basic Vesta config
echo "Creating Vesta config..."
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

# Create admin system user if not exists
echo "Creating admin user..."
if ! id admin 2>/dev/null; then
    # Check if admin group exists
    if getent group admin >/dev/null; then
        useradd -m -s /bin/bash -g admin admin
    else
        useradd -m -s /bin/bash admin
    fi
fi

# Set admin password
HASH=$(openssl passwd -6 "admin")
usermod -p "$HASH" admin

# IMPORTANT: Add email to GECOS field (v-list-users filters by @ in /etc/passwd)
usermod -c "admin@localhost" admin

# Create admin Vesta data
cat > /usr/local/vesta/data/users/admin/user.conf << 'EOF'
NAME="System Administrator"
FNAME="System"
LNAME="Administrator"
PACKAGE="default"
CONTACT="admin@localhost"
CRON_REPORTS="no"
MD5=""
RKEY=""
SUSPENDED="no"
IP_AVAIL=""
IP_OWNED=""
U_USERS="1"
U_DISK="0"
U_DISK_DIRS="0"
U_DISK_WEB="0"
U_DISK_MAIL="0"
U_DISK_DB="0"
U_BANDWIDTH="0"
U_WEB_DOMAINS="0"
U_WEB_SSL="0"
U_WEB_ALIASES="0"
U_DNS_DOMAINS="0"
U_DNS_RECORDS="0"
U_MAIL_DOMAINS="0"
U_MAIL_DKIM="0"
U_MAIL_ACCOUNTS="0"
U_DATABASES="0"
U_CRON_JOBS="0"
U_BACKUPS="0"
LANGUAGE="en"
TIME=""
DATE=""
EOF

# Create default package
cat > /usr/local/vesta/data/packages/default.pkg << 'EOF'
WEB_TEMPLATE="default"
BACKEND_TEMPLATE="default"
PROXY_TEMPLATE="default"
DNS_TEMPLATE="default"
WEB_DOMAINS="unlimited"
WEB_ALIASES="unlimited"
DNS_DOMAINS="unlimited"
DNS_RECORDS="unlimited"
MAIL_DOMAINS="unlimited"
MAIL_ACCOUNTS="unlimited"
DATABASES="unlimited"
CRON_JOBS="unlimited"
DISK_QUOTA="unlimited"
BANDWIDTH="unlimited"
NS="ns1.example.com,ns2.example.com"
SHELL="bash"
BACKUPS="3"
EOF

# Add VESTA environment to PHP-FPM
echo "Configuring PHP-FPM..."
if ! grep -q "env\[VESTA\]" /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf 2>/dev/null; then
    echo "env[VESTA] = /usr/local/vesta" >> /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf
fi

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
echo "Username: admin"
echo "Password: admin"
echo ""
echo "Note: This is a minimal test setup for UI development."
echo "Services like Apache, MySQL, Mail will show as 'stopped'."
echo "For full functionality, run the complete installer."
echo ""
