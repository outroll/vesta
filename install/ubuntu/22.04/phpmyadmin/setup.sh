#!/bin/bash
# phpMyAdmin setup script for Vesta Control Panel
# Ubuntu 22.04 LTS

# Install phpMyAdmin
export DEBIAN_FRONTEND=noninteractive
apt-get install -y phpmyadmin

# Create phpMyAdmin database and user
PHPMYADMIN_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)

mysql -e "DROP USER IF EXISTS 'phpmyadmin'@'localhost';"
mysql -e "CREATE USER 'phpmyadmin'@'localhost' IDENTIFIED BY '$PHPMYADMIN_PASS';"
mysql -e "CREATE DATABASE IF NOT EXISTS phpmyadmin;"
mysql -e "GRANT ALL PRIVILEGES ON phpmyadmin.* TO 'phpmyadmin'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Import phpMyAdmin tables
mysql phpmyadmin < /usr/share/phpmyadmin/sql/create_tables.sql

# Update phpMyAdmin config-db.php
cat > /etc/phpmyadmin/config-db.php << EOF
<?php
\$dbuser='phpmyadmin';
\$dbpass='$PHPMYADMIN_PASS';
\$basepath='';
\$dbname='phpmyadmin';
\$dbserver='localhost';
\$dbport='3306';
\$dbtype='mysql';
EOF

# Enable Apache phpMyAdmin config
ln -sf /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf
a2enconf phpmyadmin
systemctl reload apache2

# Install nginx proxy config
cp /usr/local/vesta/install/ubuntu/22.04/phpmyadmin/nginx.conf /etc/nginx/conf.d/phpmyadmin.conf

# Open firewall port 8084
iptables -I INPUT -p tcp --dport 8084 -j ACCEPT

# Reload nginx
nginx -t && systemctl reload nginx

# Add phpMyAdmin URL to Vesta config
if ! grep -q "DB_PMA_URL" /usr/local/vesta/conf/vesta.conf; then
    echo "DB_PMA_URL='https://\$(hostname -f):8084/'" >> /usr/local/vesta/conf/vesta.conf
fi

echo "phpMyAdmin installed successfully!"
echo "Access URL: https://your-server:8084/"
