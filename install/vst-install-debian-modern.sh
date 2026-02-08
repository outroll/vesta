#!/bin/bash

# Vesta Debian installer - Modernized v.1.0
# Supports: Debian 10 (Buster), 11 (Bullseye), 12 (Bookworm)
# PHP 8.2, 8.3, 8.4 | MariaDB 10.11+ or MySQL 8.0+ | PostgreSQL 16+

#----------------------------------------------------------#
#                  Variables&Functions                     #
#----------------------------------------------------------#
export PATH=$PATH:/sbin
export DEBIAN_FRONTEND=noninteractive
RHOST='apt.vestacp.com'
CHOST='c.vestacp.com'
VERSION='debian'
VESTA='/usr/local/vesta'
memory=$(grep 'MemTotal' /proc/meminfo |tr ' ' '\n' |grep [0-9])
arch=$(uname -i)
os='debian'
release=$(lsb_release -s -r | cut -d. -f1)
codename="$(lsb_release -s -c)"
vestacp="$VESTA/install/$VERSION/$release"

# Default PHP version (8.3 recommended)
php_version="8.3"

# Defining software pack for modern Debian (10+)
software="nginx apache2 apache2-suexec-custom apache2-utils
    awstats bc bind9 bsdmainutils clamav-daemon cron curl dnsutils
    dovecot-imapd dovecot-pop3d e2fsprogs exim4 exim4-daemon-heavy
    expect fail2ban flex ftp git idn imagemagick libapache2-mod-fcgid
    libapache2-mod-php${php_version} libapache2-mod-rpaf libapache2-mod-ruid2
    lsof mc mariadb-client mariadb-common mariadb-server ntpdate
    php${php_version}-cgi php${php_version}-common php${php_version}-curl
    php${php_version}-fpm php${php_version}-mysql php${php_version}-pgsql
    php${php_version}-cli php${php_version}-gd php${php_version}-mbstring
    php${php_version}-xml php${php_version}-zip php${php_version}-bcmath
    php${php_version}-soap php${php_version}-intl php${php_version}-imap
    postgresql postgresql-contrib proftpd-basic quota roundcube-core
    roundcube-mysql roundcube-plugins rrdtool rssh spamassassin sudo
    vesta vesta-ioncube vesta-nginx vesta-php vesta-softaculous
    vim-common vsftpd webalizer whois zip net-tools software-properties-common
    apt-transport-https ca-certificates gnupg2"

# Defining help function
help() {
    echo "Usage: $0 [OPTIONS]
  -a, --apache            Install Apache           [yes|no]  default: yes
  -n, --nginx             Install Nginx            [yes|no]  default: yes
  -w, --phpfpm            Install PHP-FPM          [yes|no]  default: no
  -v, --vsftpd            Install Vsftpd           [yes|no]  default: yes
  -j, --proftpd           Install ProFTPD          [yes|no]  default: no
  -k, --named             Install Bind             [yes|no]  default: yes
  -m, --mysql             Install MySQL/MariaDB    [yes|no]  default: yes
  -g, --postgresql        Install PostgreSQL       [yes|no]  default: no
  -x, --exim              Install Exim             [yes|no]  default: yes
  -z, --dovecot           Install Dovecot          [yes|no]  default: yes
  -c, --clamav            Install ClamAV           [yes|no]  default: yes
  -t, --spamassassin      Install SpamAssassin     [yes|no]  default: yes
  -i, --iptables          Install Iptables         [yes|no]  default: yes
  -b, --fail2ban          Install Fail2ban         [yes|no]  default: yes
  -o, --softaculous       Install Softaculous      [yes|no]  default: yes
  -q, --quota             Filesystem Quota         [yes|no]  default: no
  -l, --lang              Default language                default: en
  --php                   PHP version              [8.2|8.3|8.4]  default: 8.3
  -y, --interactive       Interactive install      [yes|no]  default: yes
  -s, --hostname          Set hostname
  -u, --ssl               Add LE SSL for hostname  [yes|no]  default: no
  -e, --email             Set admin email
  -d, --port              Set Vesta port
  -p, --password          Set admin password
  -f, --force             Force installation
  -h, --help              Print this help

  Example: bash $0 -e admin@example.com -p password --php 8.3"
    exit 1
}

# Defining password-gen function
gen_pass() {
    MATRIX='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    LENGTH=10
    while [ ${n:=1} -le $LENGTH ]; do
        PASS="$PASS${MATRIX:$(($RANDOM%${#MATRIX})):1}"
        let n+=1
    done
    echo "$PASS"
}

# Defining return code check function
check_result() {
    if [ $1 -ne 0 ]; then
        echo "Error: $2"
        exit $1
    fi
}

# Defining function to set default value
set_default_value() {
    eval variable=\$$1
    if [ -z "$variable" ]; then
        eval $1=$2
    fi
    if [ "$variable" != 'yes' ] && [ "$variable" != 'no' ]; then
        eval $1=$2
    fi
}

#----------------------------------------------------------#
#                    Verifications                         #
#----------------------------------------------------------#

# Check Debian version - only support 10+
supported_versions="10 11 12"
if ! echo "$supported_versions" | grep -w "$release" > /dev/null; then
    echo "=========================================================="
    echo "ERROR: Unsupported Debian version: $release ($codename)"
    echo "=========================================================="
    echo ""
    echo "This installer only supports:"
    echo "  - Debian 10 (Buster)"
    echo "  - Debian 11 (Bullseye)"
    echo "  - Debian 12 (Bookworm)"
    echo ""
    echo "Your system: Debian $release ($codename)"
    echo ""
    echo "Debian versions older than 10 are End of Life and have"
    echo "critical security vulnerabilities."
    echo ""
    echo "Please upgrade to a supported release."
    echo "=========================================================="
    exit 1
fi

echo "=========================================================="
echo "  Vesta Control Panel - Modern Debian Installation"
echo "=========================================================="
echo ""
echo "  OS: Debian $release ($codename)"
echo "  PHP Version: $php_version"
echo "  Database: MariaDB 10.11+"
echo ""
echo "  This installer uses modern, supported software versions:"
echo "  - PHP $php_version (from sury.org)"
echo "  - MariaDB 10.11+ (from distribution repos)"
echo "  - Nginx (latest stable)"
echo "  - PostgreSQL 16+ (if selected)"
echo ""
echo "=========================================================="
echo ""

# Checking root permissions
if [ "x$(id -u)" != 'x0' ]; then
    check_result 1 "Script can only be executed by root"
fi

# Checking wget
if [ ! -e '/usr/bin/wget' ]; then
    apt-get -y install wget
    check_result $? "Can't install wget"
fi

# Add PHP repository from sury.org
echo "Adding PHP $php_version repository..."
wget -qO /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $codename main" > /etc/apt/sources.list.d/php.list

# Add Nginx repository
echo "deb http://nginx.org/packages/debian/ $codename nginx" > /etc/apt/sources.list.d/nginx.list
wget http://nginx.org/keys/nginx_signing.key -O - | apt-key add -

# Update package list
echo "Updating package lists..."
apt-get update
check_result $? "apt-get update failed"

#----------------------------------------------------------#
#                     Package Installation                  #
#----------------------------------------------------------#

# Install base software
echo "Installing Vesta Control Panel and dependencies..."
echo "This may take 10-20 minutes depending on your connection..."

# Install Nginx
if [ "$nginx" = 'yes' ]; then
    echo "Installing Nginx..."
    apt-get -y install nginx
    check_result $? 'Failed to install Nginx'
    systemctl stop nginx
fi

# Install Apache
if [ "$apache" = 'yes' ]; then
    echo "Installing Apache..."
    apt-get -y install apache2 apache2-utils apache2-suexec-custom libapache2-mod-fcgid libapache2-mod-rpaf libapache2-mod-ruid2
    check_result $? 'Failed to install Apache'
    systemctl stop apache2
fi

# Install PHP
echo "Installing PHP $php_version and extensions..."
apt-get -y install \
    php${php_version} \
    php${php_version}-cli \
    php${php_version}-common \
    php${php_version}-fpm \
    php${php_version}-cgi \
    php${php_version}-mysql \
    php${php_version}-pgsql \
    php${php_version}-curl \
    php${php_version}-gd \
    php${php_version}-mbstring \
    php${php_version}-xml \
    php${php_version}-zip \
    php${php_version}-bcmath \
    php${php_version}-soap \
    php${php_version}-intl \
    php${php_version}-imap \
    php${php_version}-readline \
    php${php_version}-xmlrpc \
    libapache2-mod-php${php_version}
check_result $? 'Failed to install PHP'

# Install MariaDB/MySQL
if [ "$mysql" = 'yes' ]; then
    echo "Installing MariaDB..."
    apt-get -y install mariadb-server mariadb-client
    check_result $? 'Failed to install MariaDB'
    systemctl stop mariadb
fi

# Install PostgreSQL
if [ "$postgresql" = 'yes' ]; then
    echo "Installing PostgreSQL..."
    apt-get -y install postgresql postgresql-contrib
    check_result $? 'Failed to install PostgreSQL'
    systemctl stop postgresql
fi

# Install Bind DNS server
if [ "$named" = 'yes' ]; then
    echo "Installing Bind DNS..."
    apt-get -y install bind9 dnsutils
    check_result $? 'Failed to install Bind'
    systemctl stop bind9
fi

# Install Exim mail server
if [ "$exim" = 'yes' ]; then
    echo "Installing Exim..."
    apt-get -y install exim4 exim4-daemon-heavy
    check_result $? 'Failed to install Exim'
    systemctl stop exim4
fi

# Install Dovecot
if [ "$dovecot" = 'yes' ]; then
    echo "Installing Dovecot..."
    apt-get -y install dovecot-imapd dovecot-pop3d
    check_result $? 'Failed to install Dovecot'
    systemctl stop dovecot
fi

# Install ClamAV
if [ "$clamd" = 'yes' ]; then
    echo "Installing ClamAV..."
    apt-get -y install clamav-daemon
    check_result $? 'Failed to install ClamAV'
    systemctl stop clamav-daemon || true
fi

# Install SpamAssassin
if [ "$spamd" = 'yes' ]; then
    echo "Installing SpamAssassin..."
    apt-get -y install spamassassin
    check_result $? 'Failed to install SpamAssassin'
fi

# Install FTP server
if [ "$vsftpd" = 'yes' ]; then
    echo "Installing vsftpd..."
    apt-get -y install vsftpd
    check_result $? 'Failed to install vsftpd'
    systemctl stop vsftpd
fi

if [ "$proftpd" = 'yes' ]; then
    echo "Installing ProFTPD..."
    apt-get -y install proftpd-basic
    check_result $? 'Failed to install ProFTPD'
    systemctl stop proftpd
fi

# Install fail2ban
if [ "$fail2ban" = 'yes' ]; then
    echo "Installing fail2ban..."
    apt-get -y install fail2ban
    check_result $? 'Failed to install fail2ban'
    systemctl stop fail2ban
fi

# Install additional utilities
echo "Installing additional utilities..."
apt-get -y install \
    awstats bc bsdmainutils cron curl e2fsprogs expect \
    flex ftp git idn imagemagick lsof mc ntpdate quota \
    rrdtool rssh sudo vim-common webalizer whois zip net-tools
check_result $? 'Failed to install utilities'

# Install Roundcube webmail
echo "Installing Roundcube webmail..."
debconf-set-selections <<< "roundcube-core roundcube/dbconfig-install boolean true"
debconf-set-selections <<< "roundcube-core roundcube/database-type select mysql"
DEBIAN_FRONTEND=noninteractive apt-get -y install roundcube roundcube-mysql roundcube-plugins || true

# Install phpMyAdmin
echo "Installing phpMyAdmin..."
debconf-set-selections <<< "phpmyadmin phpmyadmin/dbconfig-install boolean true"
debconf-set-selections <<< "phpmyadmin phpmyadmin/reconfigure-webserver multiselect none"
DEBIAN_FRONTEND=noninteractive apt-get -y install phpmyadmin || true

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
    $VESTA/web/rrd \
    $VESTA/data/ips \
    $VESTA/data/queue \
    $VESTA/data/users \
    $VESTA/data/firewall \
    $VESTA/data/packages

# Create auth.log for login tracking
touch $VESTA/log/auth.log
chmod 640 $VESTA/log/auth.log

# Download and install Vesta packages
apt-get -y install vesta vesta-nginx vesta-php
check_result $? 'Failed to install Vesta packages'

# Copy configuration templates from our modern configs
if [ -d "$VESTA/install/debian/$release" ]; then
    echo "Applying modern configuration templates..."

    # Copy PHP configurations
    if [ -d "$VESTA/install/debian/$release/php" ]; then
        cp -f $VESTA/install/debian/$release/php/php.ini /etc/php/$php_version/fpm/php.ini
        cp -f $VESTA/install/debian/$release/php/www.conf /etc/php/$php_version/fpm/pool.d/www.conf
    fi

    # Copy Nginx configurations
    if [ -d "$VESTA/install/debian/$release/nginx" ]; then
        cp -f $VESTA/install/debian/$release/nginx/nginx.conf /etc/nginx/nginx.conf
    fi

    # Copy Apache configurations
    if [ "$apache" = 'yes' ] && [ -d "$VESTA/install/debian/$release/apache2" ]; then
        cp -f $VESTA/install/debian/$release/apache2/apache2.conf /etc/apache2/apache2.conf
    fi

    # Copy MariaDB configurations
    if [ "$mysql" = 'yes' ] && [ -d "$VESTA/install/debian/$release/mysql" ]; then
        cp -f $VESTA/install/debian/$release/mysql/my.cnf /etc/mysql/my.cnf
    fi

    # Copy fail2ban configurations
    if [ "$fail2ban" = 'yes' ] && [ -d "$VESTA/install/debian/$release/fail2ban" ]; then
        cp -f $VESTA/install/debian/$release/fail2ban/jail.local /etc/fail2ban/jail.local
    fi
fi

#----------------------------------------------------------#
#                  Configure Web Servers                   #
#----------------------------------------------------------#

# Configure Apache to listen on 8080 (behind Nginx)
if [ "$apache" = 'yes' ]; then
    echo "Configuring Apache as backend..."
    sed -i 's/Listen 80/Listen 127.0.0.1:8080/' /etc/apache2/ports.conf
    sed -i 's/:80>/:8080>/' /etc/apache2/sites-available/000-default.conf

    # Enable required modules
    a2enmod rewrite ssl actions fcgid alias proxy_fcgi setenvif
    a2dismod mpm_prefork
    a2enmod mpm_event
fi

# Configure Nginx
if [ "$nginx" = 'yes' ]; then
    echo "Configuring Nginx as frontend..."
    rm -f /etc/nginx/sites-enabled/default
    rm -f /etc/nginx/conf.d/default.conf

    # Add bytes log format for Vesta traffic tracking
    if ! grep -q 'log_format bytes' /etc/nginx/nginx.conf; then
        line=$(grep -n "http {" /etc/nginx/nginx.conf | cut -d: -f1)
        if [ -n "$line" ]; then
            nextline=$((line + 1))
            sed -i "${nextline}i\\    log_format bytes \"\\\$body_bytes_sent\";" /etc/nginx/nginx.conf
        fi
    fi
fi

#----------------------------------------------------------#
#                  Configure Database                      #
#----------------------------------------------------------#

if [ "$mysql" = 'yes' ]; then
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

    echo "MariaDB root password: $mpass" >> $tmpfile

    # Create Vesta MySQL host configuration
    cat > $VESTA/conf/mysql.conf << MYSQLCONF
HOST='localhost' USER='root' PASSWORD='$mpass' CHARSETS='UTF8,LATIN1,WIN1250,WIN1251,WIN1252,WIN1256,WIN1258,KOI8' MAX_DB='500' U_SYS_USERS='1' U_DB_BASES='0' TPL='default' SUSPENDED='no'
MYSQLCONF
    chmod 640 $VESTA/conf/mysql.conf
fi

#----------------------------------------------------------#
#                  Configure PHP-FPM                       #
#----------------------------------------------------------#

echo "Configuring PHP-FPM..."

# Ensure PHP-FPM socket directory exists
mkdir -p /run/php
chown www-data:www-data /run/php

# Create PHP-FPM log directory
mkdir -p /var/log/php
chown www-data:www-data /var/log/php

# Start PHP-FPM
systemctl enable php${php_version}-fpm
systemctl start php${php_version}-fpm
check_result $? 'Failed to start PHP-FPM'

#----------------------------------------------------------#
#                  Configure Mail Services                 #
#----------------------------------------------------------#

if [ "$exim" = 'yes' ]; then
    echo "Configuring Exim..."
    systemctl enable exim4
fi

if [ "$dovecot" = 'yes' ]; then
    echo "Configuring Dovecot..."
    systemctl enable dovecot
fi

if [ "$clamd" = 'yes' ]; then
    echo "Configuring ClamAV..."
    freshclam
    systemctl enable clamav-daemon
fi

if [ "$spamd" = 'yes' ]; then
    echo "Configuring SpamAssassin..."
    systemctl enable spamassassin
fi

#----------------------------------------------------------#
#                  Configure DNS                           #
#----------------------------------------------------------#

if [ "$named" = 'yes' ]; then
    echo "Configuring Bind DNS..."
    systemctl enable bind9
fi

#----------------------------------------------------------#
#                  Configure FTP                           #
#----------------------------------------------------------#

if [ "$vsftpd" = 'yes' ]; then
    echo "Configuring vsftpd..."
    systemctl enable vsftpd
fi

if [ "$proftpd" = 'yes' ]; then
    echo "Configuring ProFTPD..."
    systemctl enable proftpd
fi

#----------------------------------------------------------#
#                  Configure Firewall                      #
#----------------------------------------------------------#

if [ "$iptables" = 'yes' ]; then
    echo "Configuring firewall rules..."

    # Create basic firewall rules
    mkdir -p $VESTA/data/firewall

    cat > $VESTA/data/firewall/rules.conf <<EOF
# SSH
ACCEPT 22

# HTTP/HTTPS
ACCEPT 80
ACCEPT 443

# Vesta Control Panel
ACCEPT $port

# Mail
ACCEPT 25
ACCEPT 465
ACCEPT 587
ACCEPT 110
ACCEPT 995
ACCEPT 143
ACCEPT 993

# DNS
ACCEPT 53

# FTP
ACCEPT 21
ACCEPT 12000:12100
EOF
fi

if [ "$fail2ban" = 'yes' ]; then
    echo "Configuring fail2ban..."
    systemctl enable fail2ban
    systemctl start fail2ban
fi

#----------------------------------------------------------#
#                  Configure Vesta User                    #
#----------------------------------------------------------#

echo "Configuring Vesta admin user..."

# Set admin password
echo "admin:$vpass" | chpasswd

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

if [ "$ssl" = 'yes' ] && [ ! -z "$servername" ]; then
    echo "Requesting Let's Encrypt SSL certificate for Vesta..."

    mkdir -p /var/www/html

    ~/.acme.sh/acme.sh --issue \
        -d $servername \
        -w /var/www/html \
        --server letsencrypt \
        --keylength 2048 \
        --force

    if [ $? -eq 0 ]; then
        mkdir -p $VESTA/ssl
        ~/.acme.sh/acme.sh --install-cert -d $servername \
            --cert-file $VESTA/ssl/certificate.crt \
            --key-file $VESTA/ssl/certificate.key \
            --fullchain-file $VESTA/ssl/certificate.pem

        echo "SSL certificate installed for $servername"
    else
        echo "Failed to obtain SSL certificate. Using self-signed certificate."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout $VESTA/ssl/certificate.key \
            -out $VESTA/ssl/certificate.crt \
            -subj "/CN=$servername"
    fi
else
    echo "Generating self-signed SSL certificate..."
    mkdir -p $VESTA/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $VESTA/ssl/certificate.key \
        -out $VESTA/ssl/certificate.crt \
        -subj "/CN=$servername"
fi

#----------------------------------------------------------#
#                  Start All Services                      #
#----------------------------------------------------------#

echo "Starting all services..."

# Start web servers
[ "$nginx" = 'yes' ] && systemctl start nginx && systemctl enable nginx
[ "$apache" = 'yes' ] && systemctl start apache2 && systemctl enable apache2

# Start mail services
[ "$exim" = 'yes' ] && systemctl start exim4
[ "$dovecot" = 'yes' ] && systemctl start dovecot
[ "$clamd" = 'yes' ] && systemctl start clamav-daemon
[ "$spamd" = 'yes' ] && systemctl start spamassassin

# Start DNS
[ "$named" = 'yes' ] && systemctl start bind9

# Start FTP
[ "$vsftpd" = 'yes' ] && systemctl start vsftpd
[ "$proftpd" = 'yes' ] && systemctl start proftpd

# Start Vesta
systemctl enable vesta
systemctl start vesta

#----------------------------------------------------------#
#                  Final Configuration                     #
#----------------------------------------------------------#

# Update system time
ntpdate -u pool.ntp.org

# Create necessary system directories
echo "Creating system directories..."
mkdir -p /var/log/apache2/domains
mkdir -p /etc/apache2/conf.d
touch /etc/apache2/conf.d/vesta.conf

# Setup Roundcube webmail symlink and database
if [ -d "/usr/share/roundcube" ]; then
    ln -sf /usr/share/roundcube $VESTA/web/webmail
    if [ -f "/etc/roundcube/config.inc.php" ]; then
        sed -i "s/\$config\['default_host'\].*/\$config['default_host'] = 'localhost';/" /etc/roundcube/config.inc.php
    fi
    # Fix roundcube database permissions
    if [ -f "/etc/roundcube/debian-db.php" ]; then
        rcpass=$(grep '^\$dbpass' /etc/roundcube/debian-db.php | cut -d\' -f2)
        if [ -n "$rcpass" ]; then
            mysql -e "CREATE DATABASE IF NOT EXISTS roundcube;"
            mysql -e "DROP USER IF EXISTS 'roundcube'@'localhost';" 2>/dev/null
            mysql -e "CREATE USER 'roundcube'@'localhost' IDENTIFIED BY '$rcpass';"
            mysql -e "GRANT ALL PRIVILEGES ON roundcube.* TO 'roundcube'@'localhost';"
            mysql -e "FLUSH PRIVILEGES;"
            mysql roundcube < /usr/share/roundcube/SQL/mysql.initial.sql 2>/dev/null || true
        fi
    fi
fi

# Setup phpMyAdmin symlink
if [ -d "/usr/share/phpmyadmin" ]; then
    ln -sf /usr/share/phpmyadmin $VESTA/web/phpmyadmin
fi

# Add phpMyAdmin and Roundcube location blocks to vesta-nginx config
if [ -f "$VESTA/nginx/conf/nginx.conf" ]; then
    # Detect PHP-FPM socket
    php_socket=$(ls /run/php/php*-fpm.sock 2>/dev/null | head -1)
    if [ -z "$php_socket" ]; then
        php_socket="/var/run/vesta-php.sock"
    fi

    # Check if location blocks already exist
    if ! grep -q "location /phpmyadmin" $VESTA/nginx/conf/nginx.conf; then
        # Add location blocks before the closing brace of the server block
        sed -i '/location ~ \\\.php\$/i\
\        # phpMyAdmin location\
\        location /phpmyadmin {\
\            alias /usr/share/phpmyadmin;\
\            index index.php;\
\
\            location ~ ^/phpmyadmin/(.*.php)$ {\
\                alias /usr/share/phpmyadmin/$1;\
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
\            alias /usr/share/roundcube;\
\            index index.php;\
\
\            location ~ ^/webmail/(.*.php)$ {\
\                alias /usr/share/roundcube/$1;\
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
if [ -d "$VESTA/install/debian/$release/packages" ]; then
    cp -rf $VESTA/install/debian/$release/packages/* $VESTA/data/packages/
fi

# Copy templates from install directory
echo "Copying web and DNS templates..."
mkdir -p $VESTA/data/templates
if [ -d "$VESTA/install/debian/$release/templates" ]; then
    cp -rf $VESTA/install/debian/$release/templates/* $VESTA/data/templates/
elif [ -d "$VESTA/install/debian/12/templates" ]; then
    cp -rf $VESTA/install/debian/12/templates/* $VESTA/data/templates/
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
systemctl restart cron

# Generate initial RRD statistics
echo "Generating initial statistics..."
$VESTA/bin/v-update-sys-rrd

# Clean up
apt-get -y autoremove
apt-get clean

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
echo "  OS:         Debian $release ($codename)"
echo "  PHP:        $php_version"
echo "  Database:   $([ "$mysql" = 'yes' ] && echo 'MariaDB' || echo 'None')"
echo "  Web:        $([ "$nginx" = 'yes' ] && echo 'Nginx' || echo '')$([ "$nginx" = 'yes' ] && [ "$apache" = 'yes' ] && echo ' + ' || echo '')$([ "$apache" = 'yes' ] && echo 'Apache' || echo '')"
echo "  Mail:       $([ "$exim" = 'yes' ] && echo 'Exim + Dovecot' || echo 'None')"
echo "  DNS:        $([ "$named" = 'yes' ] && echo 'Bind' || echo 'None')"
echo "  FTP:        $([ "$vsftpd" = 'yes' ] && echo 'vsftpd' || echo '')$([ "$proftpd" = 'yes' ] && echo 'ProFTPD' || echo '')"
echo "  Firewall:   $([ "$fail2ban" = 'yes' ] && echo 'fail2ban + iptables' || echo 'iptables')"
echo ""
echo "  Important Notes:"
echo "  ───────────────────────────────────────────────────────"
echo "  • Please save the password above in a secure location"
echo "  • First login may take a few seconds to load"
echo "  • Documentation: https://vestacp.com/docs/"
echo "  • Support Forum: https://forum.vestacp.com/"
echo ""
if [ "$mysql" = 'yes' ]; then
    echo "  Database Root Password:"
    echo "  ───────────────────────────────────────────────────────"
    echo "  MySQL/MariaDB root password is saved in: /root/.my.cnf"
    echo ""
fi
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
OS:         Debian $release ($codename)
PHP:        $php_version
Database:   $([ "$mysql" = 'yes' ] && echo 'MariaDB' || echo 'None')
Web:        $([ "$nginx" = 'yes' ] && echo 'Nginx' || echo '')$([ "$nginx" = 'yes' ] && [ "$apache" = 'yes' ] && echo ' + ' || echo '')$([ "$apache" = 'yes' ] && echo 'Apache' || echo '')
Mail:       $([ "$exim" = 'yes' ] && echo 'Exim + Dovecot' || echo 'None')
DNS:        $([ "$named" = 'yes' ] && echo 'Bind' || echo 'None')
FTP:        $([ "$vsftpd" = 'yes' ] && echo 'vsftpd' || echo '')$([ "$proftpd" = 'yes' ] && echo 'ProFTPD' || echo '')
Security:   $([ "$fail2ban" = 'yes' ] && echo 'fail2ban + iptables' || echo 'iptables')

Additional Information:
────────────────────────────────────────────────────────────
$([ "$mysql" = 'yes' ] && echo "MySQL/MariaDB root password: Saved in /root/.my.cnf" || echo "")

Documentation: https://vestacp.com/docs/
Support:       https://forum.vestacp.com/

═══════════════════════════════════════════════════════════
EOF

echo "Installation details have been saved to: /root/vesta_install_info.txt"
echo ""

# Remove temp file
rm -f $tmpfile

exit 0
