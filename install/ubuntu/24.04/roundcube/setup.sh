#!/bin/bash
# Roundcube webmail setup script for Vesta Control Panel
# Ubuntu 22.04 LTS

# Preseed roundcube configuration
ROUNDCUBE_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)

echo "roundcube-core roundcube/dbconfig-install boolean true" | debconf-set-selections
echo "roundcube-core roundcube/database-type select mysql" | debconf-set-selections
echo "roundcube-core roundcube/mysql/admin-pass password" | debconf-set-selections
echo "roundcube-core roundcube/mysql/app-pass password $ROUNDCUBE_PASS" | debconf-set-selections
echo "roundcube-core roundcube/app-password-confirm password $ROUNDCUBE_PASS" | debconf-set-selections
echo "roundcube-core roundcube/reconfigure-webserver multiselect apache2" | debconf-set-selections
echo "roundcube-core roundcube/hosts string localhost" | debconf-set-selections

# Install Roundcube
export DEBIAN_FRONTEND=noninteractive
apt-get install -y roundcube roundcube-mysql

# Create roundcube database and user
mysql -e "DROP DATABASE IF EXISTS roundcube;"
mysql -e "CREATE DATABASE roundcube;"
mysql -e "DROP USER IF EXISTS 'roundcube'@'localhost';"
mysql -e "CREATE USER 'roundcube'@'localhost' IDENTIFIED BY '$ROUNDCUBE_PASS';"
mysql -e "GRANT ALL PRIVILEGES ON roundcube.* TO 'roundcube'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Import roundcube schema
mysql roundcube < /usr/share/roundcube/SQL/mysql.initial.sql

# Update roundcube database config
cat > /etc/roundcube/debian-db.php << EOF
<?php
\$dbtype = 'mysql';
\$dbserver = 'localhost';
\$dbport = '';
\$dbname = 'roundcube';
\$dbuser = 'roundcube';
\$dbpass = '$ROUNDCUBE_PASS';
EOF

# Configure roundcube to use localhost as mail server
if [ -f /etc/roundcube/config.inc.php ]; then
    sed -i "s/\$config\['default_host'\].*/\$config['default_host'] = 'localhost';/" /etc/roundcube/config.inc.php
fi

# Install Apache configuration
cp /usr/local/vesta/install/ubuntu/22.04/roundcube/apache.conf /etc/apache2/conf-available/roundcube.conf
a2enconf roundcube
systemctl reload apache2

# Install nginx configuration for port 80
cp /usr/local/vesta/install/ubuntu/22.04/roundcube/nginx.conf /etc/nginx/conf.d/webmail.conf
nginx -t && systemctl reload nginx

# Add webmail URL to Vesta config
if ! grep -q "MAIL_URL" /usr/local/vesta/conf/vesta.conf; then
    echo "MAIL_URL='/webmail/'" >> /usr/local/vesta/conf/vesta.conf
fi

echo "Roundcube webmail installed successfully!"
echo "Access URL: http://your-server/webmail/"
