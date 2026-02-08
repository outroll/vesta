#!/bin/bash

# Vesta RHEL/Rocky/AlmaLinux installer - Modernized v.1.0
# Supports: RHEL 8, 9 | Rocky Linux 8, 9 | AlmaLinux 8, 9
# PHP 8.2, 8.3, 8.4 | MariaDB 10.11+ or MySQL 8.0+ | PostgreSQL 16+

#----------------------------------------------------------#
#                  Variables&Functions                     #
#----------------------------------------------------------#
export PATH=$PATH:/sbin
RHOST='r.vestacp.com'
CHOST='c.vestacp.com'
VERSION='rhel'
VESTA='/usr/local/vesta'
memory=$(grep 'MemTotal' /proc/meminfo |tr ' ' '\n' |grep [0-9])
arch=$(uname -i)

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    os=$ID
    release=$VERSION_ID
    release_major=$(echo $VERSION_ID | cut -d. -f1)
else
    os=$(cut -f 1 -d ' ' /etc/redhat-release)
    release=$(grep -o "[0-9]" /etc/redhat-release | head -n1)
    release_major=$release
fi

codename="${os}_${release_major}"
vestacp="$VESTA/install/$VERSION/$release_major"

# Default PHP version (8.3 recommended)
php_version="8.3"

# Defining software pack for modern RHEL (8+)
software="nginx httpd httpd-tools mod_ssl mod_fcgid mod_proxy_fcgi
    awstats bc bind bind-utils clamav clamd clamav-update curl
    dovecot e2fsprogs exim fail2ban firewalld GeoIP git idn
    ImageMagick jwhois lsof mailx mariadb mariadb-server net-tools
    ntp php php-bcmath php-cli php-common php-fpm php-gd php-imap
    php-mbstring php-mysqlnd php-pdo php-pgsql php-soap php-xml
    php-xmlrpc postgresql postgresql-server proftpd quota
    roundcubemail rrdtool screen spamassassin sudo tar vim-common
    vsftpd webalizer which zip unzip"

# Help function
help() {
    echo "Usage: $0 [OPTIONS]
  -a, --apache            Install Apache           [yes|no]  default: yes
  -n, --nginx             Install Nginx            [yes|no]  default: yes
  -w, --phpfpm            Install PHP-FPM          [yes|no]  default: no
  --php                   PHP version              [8.2|8.3|8.4]  default: 8.3
  -e, --email             Set admin email
  -p, --password          Set admin password
  -h, --help              Print this help"
    exit 1
}

# Check RHEL version - only support 8+
if [ "$release_major" -lt 8 ]; then
    echo "=========================================================="
    echo "ERROR: Unsupported RHEL/Rocky/AlmaLinux version: $release"
    echo "=========================================================="
    echo ""
    echo "This installer only supports:"
    echo "  - RHEL 8, 9"
    echo "  - Rocky Linux 8, 9"
    echo "  - AlmaLinux 8, 9"
    echo ""
    echo "Your system: $os $release"
    echo ""
    echo "Versions older than 8 are End of Life."
    echo "=========================================================="
    exit 1
fi

echo "=========================================================="
echo "  Vesta Control Panel - Modern RHEL Installation"
echo "=========================================================="
echo ""
echo "  OS: $os $release"
echo "  PHP Version: $php_version"
echo "  Database: MariaDB 10.5+"
echo ""
echo "=========================================================="
echo ""

# Install EPEL repository
dnf -y install epel-release
dnf -y install https://rpms.remirepo.net/enterprise/remi-release-${release_major}.rpm

# Enable PHP 8.3 from Remi
dnf -y module reset php
dnf -y module enable php:remi-${php_version}
dnf -y install $software

#----------------------------------------------------------#
#                     Package Installation                  #
#----------------------------------------------------------#

echo "Installing Vesta Control Panel and dependencies..."
echo "This may take 10-20 minutes depending on your connection..."

# Install base software
dnf -y install $software
check_result $? 'Failed to install software packages'

#----------------------------------------------------------#
#                  Configure System                        #
#----------------------------------------------------------#

# Generate admin password if not provided
if [ -z "$vpass" ]; then
    vpass=$(gen_pass)
fi

# Set admin email if not provided
if [ -z "$email" ]; then
    email="admin@$servername"
fi

# Set hostname if not provided
if [ -z "$servername" ]; then
    servername=$(hostname -f)
fi

# Set Vesta port if not provided
if [ -z "$port" ]; then
    port='8083'
fi

#----------------------------------------------------------#
#                  Install Vesta Core                      #
#----------------------------------------------------------#

echo "Installing Vesta Control Panel core..."

# Create Vesta admin user with proper home directory
if [ -z "$(grep ^admin: /etc/passwd)" ]; then
    # Remove stale admin group if it exists without user
    if grep -q ^admin: /etc/group && ! grep -q ^admin: /etc/passwd; then
        groupdel admin 2>/dev/null || true
    fi

    /usr/sbin/useradd admin -s /bin/bash -c "$email" -m -d /home/admin

    # Setup admin home directories for web hosting
    mkdir -p /home/admin/conf/web /home/admin/conf/mail /home/admin/conf/dns
    mkdir -p /home/admin/web /home/admin/mail /home/admin/tmp
    chmod 751 /home/admin/conf/web /home/admin/conf/mail /home/admin/conf/dns
    chmod 751 /home/admin/mail
    chmod 700 /home/admin/tmp
    chmod a+x /home/admin
    chown -R admin:admin /home/admin
fi

# Create directory structure
mkdir -p \
    $VESTA/conf \
    $VESTA/log \
    $VESTA/ssl \
    $VESTA/data/ips \
    $VESTA/data/queue \
    $VESTA/data/users \
    $VESTA/data/firewall

# Install Vesta from source (official rpm packages may not support modern RHEL/Rocky)
echo "Installing Vesta from source repository..."

# Determine repository location
REPO_DIR="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)"

# Check if we have a valid Vesta repository (look for vesta-specific files)
if [ ! -f "$REPO_DIR/bin/v-add-user" ]; then
    echo "Vesta repository not found locally, cloning from GitHub..."
    REPO_DIR="/tmp/vesta-repo"
    rm -rf $REPO_DIR
    git clone --depth 1 https://github.com/Dennis-SEG/vesta.git $REPO_DIR
    check_result $? 'Failed to clone Vesta repository'
fi

# Create bin directory
mkdir -p $VESTA/bin $VESTA/web $VESTA/data/packages

# Copy binaries
echo "Copying Vesta binaries..."
cp -rf $REPO_DIR/bin/* $VESTA/bin/
chmod +x $VESTA/bin/*

# Copy web files
echo "Copying web interface..."
cp -rf $REPO_DIR/web/* $VESTA/web/

# Fix mail-wrapper.php shebang to use system PHP
if [ -f "$VESTA/web/inc/mail-wrapper.php" ]; then
    sed -i '1s|.*|#!/usr/bin/php|' $VESTA/web/inc/mail-wrapper.php
fi

# Copy other core files
echo "Copying configuration files..."
[ -d "$REPO_DIR/func" ] && cp -rf $REPO_DIR/func $VESTA/
[ -d "$REPO_DIR/data" ] && cp -rf $REPO_DIR/data/* $VESTA/data/ 2>/dev/null || true

# Copy install directory for templates
cp -rf $REPO_DIR/install $VESTA/

# Create auth.log for login tracking
touch $VESTA/log/auth.log
chmod 640 $VESTA/log/auth.log

# Create RRD directory for statistics graphs
mkdir -p $VESTA/web/rrd
chown admin:admin $VESTA/web/rrd

echo "Vesta core files installed successfully"

#----------------------------------------------------------#
#                  Configure Web Servers                   #
#----------------------------------------------------------#

# Configure Apache to listen on 8080 (behind Nginx)
echo "Configuring Apache as backend..."
sed -i 's/Listen 80/Listen 127.0.0.1:8080/' /etc/httpd/conf/httpd.conf

# Configure Nginx
echo "Configuring Nginx as frontend..."
rm -f /etc/nginx/conf.d/default.conf

# Add bytes log format for Vesta traffic tracking
if ! grep -q 'log_format bytes' /etc/nginx/nginx.conf; then
    line=$(grep -n "http {" /etc/nginx/nginx.conf | cut -d: -f1)
    if [ -n "$line" ]; then
        nextline=$((line + 1))
        sed -i "${nextline}i\\    log_format bytes \"\\\$body_bytes_sent\";" /etc/nginx/nginx.conf
    fi
fi

#----------------------------------------------------------#
#                  Configure Database                      #
#----------------------------------------------------------#

echo "Configuring MariaDB..."

# Start MariaDB
systemctl start mariadb
check_result $? 'Failed to start MariaDB'

# Generate root password
mpass=$(gen_pass)

# Secure installation
mysql -e "DELETE FROM mysql.user WHERE User='';"
mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -e "DROP DATABASE IF EXISTS test;"
mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$mpass';"
mysql -e "FLUSH PRIVILEGES;"

# Save credentials
echo "[client]" > /root/.my.cnf
echo "user=root" >> /root/.my.cnf
echo "password='$mpass'" >> /root/.my.cnf
chmod 600 /root/.my.cnf

# Create Vesta MySQL host configuration
cat > $VESTA/conf/mysql.conf << MYSQLCONF
HOST='localhost' USER='root' PASSWORD='$mpass' CHARSETS='UTF8,LATIN1,WIN1250,WIN1251,WIN1252,WIN1256,WIN1258,KOI8' MAX_DB='500' U_SYS_USERS='1' U_DB_BASES='0' TPL='default' SUSPENDED='no'
MYSQLCONF
chmod 640 $VESTA/conf/mysql.conf

#----------------------------------------------------------#
#                  Configure PHP-FPM                       #
#----------------------------------------------------------#

echo "Configuring PHP-FPM..."

# Ensure PHP-FPM socket directory exists
mkdir -p /run/php-fpm
chown apache:apache /run/php-fpm

# Start PHP-FPM
systemctl enable php-fpm
systemctl start php-fpm
check_result $? 'Failed to start PHP-FPM'

#----------------------------------------------------------#
#                  Configure Mail Services                 #
#----------------------------------------------------------#

echo "Configuring Exim..."
systemctl enable exim

echo "Configuring Dovecot..."
systemctl enable dovecot

#----------------------------------------------------------#
#                  Configure DNS                           #
#----------------------------------------------------------#

echo "Configuring Bind DNS..."
systemctl enable named

#----------------------------------------------------------#
#                  Configure FTP                           #
#----------------------------------------------------------#

echo "Configuring vsftpd..."
systemctl enable vsftpd

#----------------------------------------------------------#
#                  Configure Firewall                      #
#----------------------------------------------------------#

echo "Configuring firewalld..."

# Allow HTTP/HTTPS
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# Allow Vesta panel
firewall-cmd --permanent --add-port=$port/tcp

# Allow Mail
firewall-cmd --permanent --add-service=smtp
firewall-cmd --permanent --add-service=smtps
firewall-cmd --permanent --add-service=submission
firewall-cmd --permanent --add-service=pop3
firewall-cmd --permanent --add-service=pop3s
firewall-cmd --permanent --add-service=imap
firewall-cmd --permanent --add-service=imaps

# Allow DNS
firewall-cmd --permanent --add-service=dns

# Allow FTP
firewall-cmd --permanent --add-service=ftp
firewall-cmd --permanent --add-port=12000-12100/tcp

# Reload firewall
firewall-cmd --reload

echo "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

#----------------------------------------------------------#
#                  Configure Vesta User                    #
#----------------------------------------------------------#

echo "Configuring Vesta admin user..."

# Set admin password
echo "admin:$vpass" | chpasswd

# Create required directories
mkdir -p $VESTA/log $VESTA/web/rrd $VESTA/data/packages

# Create auth.log for login tracking
touch $VESTA/log/auth.log
chmod 640 $VESTA/log/auth.log

# Create admin user configuration
mkdir -p $VESTA/data/users/admin

cat > $VESTA/data/users/admin/user.conf <<EOF
FNAME='System'
LNAME='Administrator'
PACKAGE='default'
WEB_TEMPLATE='default'
BACKEND_TEMPLATE='default'
PROXY_TEMPLATE='default'
DNS_TEMPLATE='default'
WEB_DOMAINS='unlimited'
WEB_ALIASES='unlimited'
DNS_DOMAINS='unlimited'
DNS_RECORDS='unlimited'
MAIL_DOMAINS='unlimited'
MAIL_ACCOUNTS='unlimited'
DATABASES='unlimited'
CRON_JOBS='unlimited'
DISK_QUOTA='unlimited'
BANDWIDTH='unlimited'
NS='ns1.$servername'
NS2='ns2.$servername'
SHELL='/bin/bash'
BACKUPS='unlimited'
TIME='$(date +%Y-%m-%d)'
DATE='$(date +%Y-%m-%d)'
SUSPENDED='no'
SUSPEND_TIME='0'
EOF

#----------------------------------------------------------#
#                  Install acme.sh                         #
#----------------------------------------------------------#

echo "Installing acme.sh for Let's Encrypt..."
curl https://get.acme.sh | sh -s email=$email
mkdir -p $VESTA/ssl/acme.sh
ln -s ~/.acme.sh/acme.sh $VESTA/ssl/acme.sh/acme.sh

#----------------------------------------------------------#
#                  Configure SSL for Vesta                 #
#----------------------------------------------------------#

echo "Generating SSL certificate..."
mkdir -p $VESTA/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $VESTA/ssl/certificate.key \
    -out $VESTA/ssl/certificate.crt \
    -subj "/CN=$servername"

#----------------------------------------------------------#
#                  Start All Services                      #
#----------------------------------------------------------#

echo "Starting all services..."

# Start web servers
systemctl start nginx && systemctl enable nginx
systemctl start httpd && systemctl enable httpd

# Start mail services
systemctl start exim
systemctl start dovecot

# Start DNS
systemctl start named

# Start FTP
systemctl start vsftpd

# Start Vesta
systemctl enable vesta
systemctl start vesta

#----------------------------------------------------------#
#                  Final Configuration                     #
#----------------------------------------------------------#

# Create necessary system directories
echo "Creating system directories..."
mkdir -p /var/log/httpd/domains
mkdir -p /etc/httpd/conf.d
touch /etc/httpd/conf.d/vesta.conf

# Setup Roundcube webmail symlink
if [ -d "/usr/share/roundcubemail" ]; then
    ln -sf /usr/share/roundcubemail $VESTA/web/webmail
    # Configure roundcube to use localhost
    if [ -f "/etc/roundcubemail/config.inc.php" ]; then
        sed -i "s/\$config\['default_host'\].*/\$config['default_host'] = 'localhost';/" /etc/roundcubemail/config.inc.php
    fi
fi

# Setup phpMyAdmin symlink
if [ -d "/usr/share/phpMyAdmin" ]; then
    ln -sf /usr/share/phpMyAdmin $VESTA/web/phpmyadmin
fi

# Add phpMyAdmin and Roundcube location blocks to vesta-nginx config
if [ -f "$VESTA/nginx/conf/nginx.conf" ]; then
    # Detect PHP-FPM socket
    php_socket=$(ls /run/php-fpm/www.sock 2>/dev/null || ls /var/run/php-fpm/www.sock 2>/dev/null || echo "/var/run/vesta-php.sock")

    # Check if location blocks already exist
    if ! grep -q "location /phpmyadmin" $VESTA/nginx/conf/nginx.conf; then
        # Add location blocks before the closing brace of the server block
        sed -i '/location ~ \\\.php\$/i\
\        # phpMyAdmin location\
\        location /phpmyadmin {\
\            alias /usr/share/phpMyAdmin;\
\            index index.php;\
\
\            location ~ ^/phpmyadmin/(.*.php)$ {\
\                alias /usr/share/phpMyAdmin/$1;\
\                fastcgi_pass unix:'"$php_socket"';\
\                fastcgi_index index.php;\
\                include fastcgi_params;\
\                fastcgi_param SCRIPT_FILENAME $request_filename;\
\            }\
\
\            location ~ ^/phpmyadmin/(doc|sql|setup)/ {\
\                deny all;\
\            }\
\        }\
\
\        # Roundcube webmail location\
\        location /webmail {\
\            alias /usr/share/roundcubemail;\
\            index index.php;\
\
\            location ~ ^/webmail/(.*.php)$ {\
\                alias /usr/share/roundcubemail/$1;\
\                fastcgi_pass unix:'"$php_socket"';\
\                fastcgi_index index.php;\
\                include fastcgi_params;\
\                fastcgi_param SCRIPT_FILENAME $request_filename;\
\            }\
\
\            location ~ ^/webmail/(config|temp|logs)/ {\
\                deny all;\
\            }\
\        }\
' $VESTA/nginx/conf/nginx.conf
    fi
fi

# Set proper permissions
chmod 750 $VESTA/data/users/admin
chown -R admin:admin $VESTA/data/users/admin
chown admin:admin $VESTA/web/rrd

# Add system IP address
echo "Adding system IP address..."
server_ip=$(hostname -I | awk '{print $1}')
server_iface=$(ip route | grep default | awk '{print $5}')
$VESTA/bin/v-add-sys-ip "$server_ip" 255.255.255.0 "$server_iface" admin shared 2>/dev/null || true

# Copy hosting packages
if [ -d "$VESTA/install/rhel/$release/packages" ]; then
    cp -rf $VESTA/install/rhel/$release/packages/* $VESTA/data/packages/
fi

# Copy templates from install directory
echo "Copying web and DNS templates..."
mkdir -p $VESTA/data/templates
if [ -d "$VESTA/install/rhel/$release_major/templates" ]; then
    cp -rf $VESTA/install/rhel/$release_major/templates/* $VESTA/data/templates/
elif [ -d "$VESTA/install/rhel/9/templates" ]; then
    cp -rf $VESTA/install/rhel/9/templates/* $VESTA/data/templates/
fi

#----------------------------------------------------------#
#                  Configure Cron Jobs                     #
#----------------------------------------------------------#

echo "Configuring scheduled tasks..."

# Add system cron jobs for Vesta maintenance
command="sudo $VESTA/bin/v-update-sys-queue disk"
$VESTA/bin/v-add-cron-job 'admin' '15' '02' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-update-sys-queue traffic"
$VESTA/bin/v-add-cron-job 'admin' '10' '00' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-update-sys-queue webstats"
$VESTA/bin/v-add-cron-job 'admin' '30' '03' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-update-sys-queue backup"
$VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-backup-users"
$VESTA/bin/v-add-cron-job 'admin' '10' '05' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-update-user-stats"
$VESTA/bin/v-add-cron-job 'admin' '20' '00' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-update-sys-rrd"
$VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command"
command="sudo $VESTA/bin/v-update-letsencrypt-ssl"
$VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command"

# Restart cron to apply changes
systemctl restart crond

# Generate initial RRD statistics
echo "Generating initial statistics..."
$VESTA/bin/v-update-sys-rrd

# Clean up
dnf clean all

#----------------------------------------------------------#
#                  Installation Complete                   #
#----------------------------------------------------------#

# Get server IP
ip=$(hostname -I | awk '{print $1}')

# Display installation information
clear
echo "=========================================================="
echo "                 INSTALLATION COMPLETE!"
echo "=========================================================="
echo ""
echo "  Vesta Control Panel has been successfully installed!"
echo ""
echo "  Access Details:"
echo "  ───────────────────────────────────────────────────────"
echo "  URL:      https://$servername:$port"
echo "  IP:       https://$ip:$port"
echo "  Username: admin"
echo "  Password: $vpass"
echo ""
echo "  Software Installed:"
echo "  ───────────────────────────────────────────────────────"
echo "  OS:         $os $release"
echo "  PHP:        $php_version"
echo "  Database:   MariaDB"
echo "  Web:        Nginx + Apache"
echo "  Mail:       Exim + Dovecot"
echo "  DNS:        Bind"
echo "  FTP:        vsftpd"
echo "  Firewall:   fail2ban + firewalld"
echo ""
echo "  Important Notes:"
echo "  ───────────────────────────────────────────────────────"
echo "  • Please save the password above in a secure location"
echo "  • First login may take a few seconds to load"
echo "  • Documentation: https://vestacp.com/docs/"
echo "  • Support Forum: https://forum.vestacp.com/"
echo ""
echo "  Database Root Password:"
echo "  ───────────────────────────────────────────────────────"
echo "  MySQL/MariaDB root password is saved in: /root/.my.cnf"
echo ""
echo "=========================================================="
echo ""

# Save installation details to file
cat > /root/vesta_install_info.txt <<EOF
Vesta Control Panel Installation Information
═══════════════════════════════════════════════════════════

Installation Date: $(date)
Server: $servername
IP: $ip

Vesta Control Panel Access:
────────────────────────────────────────────────────────────
URL:      https://$servername:$port
          https://$ip:$port
Username: admin
Password: $vpass

Software Stack:
────────────────────────────────────────────────────────────
OS:         $os $release
PHP:        $php_version
Database:   MariaDB
Web:        Nginx + Apache
Mail:       Exim + Dovecot
DNS:        Bind
FTP:        vsftpd
Security:   fail2ban + firewalld

Additional Information:
────────────────────────────────────────────────────────────
MySQL/MariaDB root password: Saved in /root/.my.cnf

Documentation: https://vestacp.com/docs/
Support:       https://forum.vestacp.com/

═══════════════════════════════════════════════════════════
EOF

echo "Installation details have been saved to: /root/vesta_install_info.txt"
echo ""

exit 0
