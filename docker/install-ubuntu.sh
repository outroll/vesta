#!/bin/bash

# Vesta Ubuntu installer v.05

#----------------------------------------------------------#
#                  Variables&Functions                     #
#----------------------------------------------------------#
export PATH=$PATH:/sbin
export DEBIAN_FRONTEND=noninteractive
RHOST='apt.vestacp.com'
CHOST='c.vestacp.com'
VERSION='ubuntu'
memory=$(grep 'MemTotal' /proc/meminfo |tr ' ' '\n' |grep [0-9])
arch=$(uname -i)
os='ubuntu'
release="$(lsb_release -r|awk '{print $2}')"
codename="$(lsb_release -c|awk '{print $2}')"
vestacp="http://$CHOST/$VERSION/$release"
software="nginx
        php7.0-fpm php7.0-common
        php7.0-mysql php7.0-curl php7.0-pgsql php7.0-mbstring
        php7.0-phpdbg php7.0-dev php7.0-sqlite3 php7.0-json php7.0-gd php7.0-cli
        awstats webalizer
        exim4 exim4-daemon-heavy bind9
        dovecot-imapd dovecot-pop3d mysql-server mysql-common
        mysql-client postgresql postgresql-contrib phppgadmin mc
        flex whois rssh git idn zip sudo bc ftp lsof ntpdate rrdtool
        e2fslibs bsdutils e2fsprogs curl imagemagick dnsutils
        bsdmainutils cron vesta vesta-nginx vesta-php"


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

# Defning return code check function
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

# Creating temporary file
tmpfile=$(mktemp -p /tmp)

# Translating argument to --gnu-long-options
for arg; do
    delim=""
    case "$arg" in
        --nginx)                args="${args}-n " ;;
        --phpfpm)               args="${args}-w " ;;
        --named)                args="${args}-k " ;;
        --mysql)                args="${args}-m " ;;
        --postgresql)           args="${args}-g " ;;
        --exim)                 args="${args}-x " ;;
        --dovecot)              args="${args}-z " ;;
        --remi)                 args="${args}-r " ;;
        --lang)                 args="${args}-l " ;;
        --interactive)          args="${args}-y " ;;
        --hostname)             args="${args}-s " ;;
        --email)                args="${args}-e " ;;
        --password)             args="${args}-p " ;;
        --force)                args="${args}-f " ;;
        *)                      [[ "${arg:0:1}" == "-" ]] || delim="\""
                                args="${args}${delim}${arg}${delim} ";;
    esac
done
eval set -- "$args"

# Parsing arguments
while getopts "a:n:w:v:j:k:m:g:d:x:z:c:t:i:b:r:q:l:y:s:e:p:fh" Option; do
    case $Option in
        n) nginx=$OPTARG ;;             # Nginx
        w) phpfpm=$OPTARG ;;            # PHP-FPM
        k) named=$OPTARG ;;             # Named
        m) mysql=$OPTARG ;;             # MySQL
        g) postgresql=$OPTARG ;;        # PostgreSQL
        x) exim=$OPTARG ;;              # Exim
        z) dovecot=$OPTARG ;;           # Dovecot
        r) remi=$OPTARG ;;              # Remi repo
        l) lang=$OPTARG ;;              # Language
        y) interactive=$OPTARG ;;       # Interactive install
        s) servername=$OPTARG ;;        # Hostname
        e) email=$OPTARG ;;             # Admin email
        p) vpass=$OPTARG ;;             # Admin password
        f) force='yes' ;;               # Force install
        h) help ;;                      # Help
        *) help ;;                      # Print help (default)
    esac
done

# Defining default software stack
set_default_value 'nginx' 'yes'
set_default_value 'phpfpm' 'yes'
set_default_value 'named' 'yes'
set_default_value 'mysql' 'yes'
set_default_value 'postgresql' 'no'
set_default_value 'exim' 'yes'
set_default_value 'dovecot' 'yes'
set_default_value 'lang' 'en'
set_default_value 'interactive' 'yes'

# Checking admin user account
if [ ! -z "$(grep ^admin: /etc/passwd /etc/group)" ] && [ -z "$force" ]; then
    echo 'Please remove admin user account before proceeding.'
    echo 'If you want to do it automatically run installer with -f option:'
    echo -e "Example: bash $0 --force\n"
    check_result 1 "User admin exists"
fi

# Checking wget
if [ ! -e '/usr/bin/wget' ]; then
    apt-get -y install wget
    check_result $? "Can't install wget"
fi

# Checking repository availability
wget -q "$vestacp/deb_signing.key" -O /dev/null
check_result $? "No access to Vesta repository"


# Set hostname if it wasn't set
if [ -z "$servername" ]; then
    servername="vesta.docker"
fi

# Set email if it wasn't set
if [ -z "$email" ]; then
    email="admin@$servername"
fi


#----------------------------------------------------------#
#                   Install repository                     #
#----------------------------------------------------------#

# Updating system
apt-get -y upgrade
check_result $? 'apt-get upgrade failed'

# Installing nginx repo
apt=/etc/apt/sources.list.d
echo "deb http://nginx.org/packages/ubuntu/ $codename nginx" > $apt/nginx.list
wget http://nginx.org/keys/nginx_signing.key -O /tmp/nginx_signing.key
apt-key add /tmp/nginx_signing.key

# Installing vesta repo
echo "deb http://$RHOST/$codename/ $codename vesta" > $apt/vesta.list
wget $CHOST/deb_signing.key -O deb_signing.key
apt-key add deb_signing.key

# Installing php7 repo
apt-get -y install python-software-properties language-pack-en-base
LC_ALL=en_US.UTF-8 add-apt-repository ppa:ondrej/php -y


#----------------------------------------------------------#
#                     Package Exludes                      #
#----------------------------------------------------------#

if [ "$postgresql" = 'no' ]; then
    software=$(echo "$software" | sed -e 's/postgresql-contrib//')
    software=$(echo "$software" | sed -e 's/postgresql//')
    software=$(echo "$software" | sed -e 's/php7.0-pgsql//')
    software=$(echo "$software" | sed -e 's/phppgadmin//')
fi

if [ "$named" = 'no' ]; then
    software=$(echo "$software" | sed -e "s/bind9//")
fi


#----------------------------------------------------------#
#                     Install packages                     #
#----------------------------------------------------------#

# Update system packages
apt-get update

# Install apt packages
apt-get -y install $software
check_result $? "apt-get install failed"


#----------------------------------------------------------#
#                     Configure system                     #
#----------------------------------------------------------#

# Enable SSH password auth
sed -i "s/rdAuthentication no/rdAuthentication yes/g" /etc/ssh/sshd_config

# Set directory color
echo 'LS_COLORS="$LS_COLORS:di=00;33"' >> /etc/profile

# Register /sbin/nologin
echo "/sbin/nologin" >> /etc/shells

# Setup rssh
if [ -z "$(grep /usr/bin/rssh /etc/shells)" ]; then
    echo /usr/bin/rssh >> /etc/shells
fi
sed -i 's/#allowscp/allowscp/' /etc/rssh.conf
sed -i 's/#allowsftp/allowsftp/' /etc/rssh.conf
sed -i 's/#allowrsync/allowrsync/' /etc/rssh.conf
chmod 755 /usr/bin/rssh


#----------------------------------------------------------#
#                     Configure VESTA                      #
#----------------------------------------------------------#

# AppArmor
aa-complain /usr/sbin/named 2>/dev/null

# Downlading sudo configuration
mkdir -p /etc/sudoers.d
wget $vestacp/sudo/admin -O /etc/sudoers.d/admin
chmod 440 /etc/sudoers.d/admin

# Configuring system env
echo "export VESTA='/usr/local/vesta'" > /etc/profile.d/vesta.sh
chmod 755 /etc/profile.d/vesta.sh
source /etc/profile.d/vesta.sh
echo 'PATH=$PATH:/usr/local/vesta/bin' >> /root/.bash_profile
echo 'export PATH' >> /root/.bash_profile
source /root/.bash_profile

# Configuring logrotate for vesta logs
wget $vestacp/logrotate/vesta -O /etc/logrotate.d/vesta

# Buidling directory tree and creating some blank files for vesta
mkdir -p $VESTA/conf $VESTA/log $VESTA/ssl $VESTA/data/ips \
    $VESTA/data/queue $VESTA/data/users $VESTA/data/firewall
touch $VESTA/data/queue/backup.pipe $VESTA/data/queue/disk.pipe \
    $VESTA/data/queue/webstats.pipe $VESTA/data/queue/restart.pipe \
    $VESTA/data/queue/traffic.pipe $VESTA/log/system.log \
    $VESTA/log/nginx-error.log $VESTA/log/auth.log
chmod 750 $VESTA/conf $VESTA/data/users $VESTA/data/ips $VESTA/log
chmod -R 750 $VESTA/data/queue
chmod 660 $VESTA/log/*
rm -f /var/log/vesta
ln -s /usr/local/vesta/log /var/log/vesta

# Generating vesta configuration
rm -f $VESTA/conf/vesta.conf 2>/dev/null
touch $VESTA/conf/vesta.conf
chmod 660 $VESTA/conf/vesta.conf

# WEB stack
echo "WEB_SYSTEM='nginx'" >> $VESTA/conf/vesta.conf
echo "WEB_PORT='80'" >> $VESTA/conf/vesta.conf
echo "WEB_SSL_PORT='443'" >> $VESTA/conf/vesta.conf
echo "WEB_SSL='openssl'"  >> $VESTA/conf/vesta.conf
echo "WEB_BACKEND='php7.0-fpm'" >> $VESTA/conf/vesta.conf
echo "STATS_SYSTEM='webalizer,awstats'" >> $VESTA/conf/vesta.conf

# DNS stack
if [ "$named" = 'yes' ]; then
    echo "DNS_SYSTEM='bind9'" >> $VESTA/conf/vesta.conf
fi

# Mail stack
echo "MAIL_SYSTEM='exim4'" >> $VESTA/conf/vesta.conf
echo "IMAP_SYSTEM='dovecot'" >> $VESTA/conf/vesta.conf

# CRON daemon
echo "CRON_SYSTEM='cron'" >> $VESTA/conf/vesta.conf

# Disk quota
if [ "$quota" = 'yes' ]; then
    echo "DISK_QUOTA='yes'" >> $VESTA/conf/vesta.conf
fi

# Backups
echo "BACKUP_SYSTEM='local'" >> $VESTA/conf/vesta.conf

# Language
echo "LANGUAGE='$lang'" >> $VESTA/conf/vesta.conf

# Version
echo "VERSION='0.9.8'" >> $VESTA/conf/vesta.conf

# Downloading hosting packages
cd $VESTA/data
wget $vestacp/packages.tar.gz -O packages.tar.gz
tar -xzf packages.tar.gz
rm -f packages.tar.gz

# Downloading templates
wget $vestacp/templates.tar.gz -O templates.tar.gz
tar -xzf templates.tar.gz
rm -f templates.tar.gz

# Copying index.html to default documentroot
cp templates/web/skel/public_html/index.html /var/www/
sed -i 's/%domain%/It worked!/g' /var/www/index.html

# Downloading firewall rules
wget $vestacp/firewall.tar.gz -O firewall.tar.gz
tar -xzf firewall.tar.gz
rm -f firewall.tar.gz

# Configuring server hostname
$VESTA/bin/v-change-sys-hostname $servername 2>/dev/null

# Generating SSL certificate
$VESTA/bin/v-generate-ssl-cert $(hostname) $email 'US' 'California' \
     'San Francisco' 'Vesta Control Panel' 'IT' > /tmp/vst.pem

# Parsing certificate file
crt_end=$(grep -n "END CERTIFICATE-" /tmp/vst.pem |cut -f 1 -d:)
key_start=$(grep -n "BEGIN RSA" /tmp/vst.pem |cut -f 1 -d:)
key_end=$(grep -n  "END RSA" /tmp/vst.pem |cut -f 1 -d:)

# Adding SSL certificate
cd $VESTA/ssl
sed -n "1,${crt_end}p" /tmp/vst.pem > certificate.crt
sed -n "$key_start,${key_end}p" /tmp/vst.pem > certificate.key
chown root:mail $VESTA/ssl/*
chmod 660 $VESTA/ssl/*
rm /tmp/vst.pem

# PHP7
mv /usr/local/vesta/data/templates/web/php5-fpm /usr/local/vesta/data/templates/web/php7.0-fpm
mv /usr/local/vesta/data/templates/web/nginx/php5-fpm /usr/local/vesta/data/templates/web/nginx/php7.0-fpm
sed -i "s/php5/php\/7.0/" /usr/local/vesta/func/domain.sh

#----------------------------------------------------------#
#                     Configure Nginx                      #
#----------------------------------------------------------#

rm -f /etc/nginx/conf.d/*.conf
wget $vestacp/nginx/nginx.conf -O /etc/nginx/nginx.conf
wget $vestacp/nginx/status.conf -O /etc/nginx/conf.d/status.conf
wget $vestacp/nginx/phpmyadmin.inc -O /etc/nginx/conf.d/phpmyadmin.inc
wget $vestacp/nginx/phppgadmin.inc -O /etc/nginx/conf.d/phppgadmin.inc
wget $vestacp/nginx/webmail.inc -O /etc/nginx/conf.d/webmail.inc
wget $vestacp/logrotate/nginx -O /etc/logrotate.d/nginx
echo > /etc/nginx/conf.d/vesta.conf
mkdir -p /var/log/nginx/domains


#----------------------------------------------------------#
#                     Configure PHP-FPM                    #
#----------------------------------------------------------#

wget $vestacp/php5-fpm/www.conf -O /etc/php/7.0/fpm/pool.d/www.conf


#----------------------------------------------------------#
#                     Configure PHP                        #
#----------------------------------------------------------#

ZONE=$(timedatectl 2>/dev/null|grep Timezone|awk '{print $2}')
if [ -z "$ZONE" ]; then
    ZONE='UTC'
fi
for pconf in $(find /etc/php* -name php.ini); do
    sed -i "s/;date.timezone =/date.timezone = $ZONE/g" $pconf
    sed -i 's%_open_tag = Off%_open_tag = On%g' $pconf
done


#----------------------------------------------------------#
#                  Configure MySQL/MariaDB                 #
#----------------------------------------------------------#

if [ "$mysql" = 'yes' ]; then
    mycnf="my-small.cnf"
    if [ $memory -gt 1200000 ]; then
        mycnf="my-medium.cnf"
    fi
    if [ $memory -gt 3900000 ]; then
        mycnf="my-large.cnf"
    fi

    # MySQL configuration
    wget $vestacp/mysql/$mycnf -O /etc/mysql/my.cnf
    mysql_install_db
    #update-rc.d mysql defaults
    service mysql start
    #check_result $? "mysql start failed"

    # Securing MySQL installation
    mysqladmin -u root password $vpass
    echo -e "[client]\npassword='$vpass'\n" > /root/.my.cnf
    chmod 600 /root/.my.cnf
    mysql -e "DELETE FROM mysql.user WHERE User=''"
    mysql -e "DROP DATABASE test" >/dev/null 2>&1
    mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%'"
    mysql -e "DELETE FROM mysql.user WHERE user='' or password='';"
    mysql -e "FLUSH PRIVILEGES"

    # install phpMyAdmin
    wget https://github.com/phpmyadmin/phpmyadmin/archive/RELEASE_4_5_5_1.zip -O /tmp/RELEASE_4_5_5_1.zip
    unzip /tmp/RELEASE_4_5_5_1.zip -d /tmp/phpmyadmin
    mkdir -p /usr/share/phpmyadmin
    mv /tmp/phpmyadmin/phpmyadmin-RELEASE_4_5_5_1/* /usr/share/phpmyadmin
    rm -rf /tmp/RELEASE_4_4_15_2.zip /tmp/phpmyadmin

    # Configuring phpMyAdmin
    wget $vestacp/pma/config.inc.php -O /usr/share/phpmyadmin/config.inc.php
    chmod 777 /var/lib/phpmyadmin/tmp
fi

#----------------------------------------------------------#
#                   Configure PostgreSQL                   #
#----------------------------------------------------------#

if [ "$postgresql" = 'yes' ]; then
    wget $vestacp/postgresql/pg_hba.conf -O /etc/postgresql/*/main/pg_hba.conf
    service postgresql restart
    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$vpass'" 2>/dev/null

    # Configuring phpPgAdmin
    if [ "$apache" = 'yes' ]; then
        wget $vestacp/pga/phppgadmin.conf -O /etc/apache2/conf.d/phppgadmin.conf
    fi
    wget $vestacp/pga/config.inc.php -O /etc/phppgadmin/config.inc.php
fi


#----------------------------------------------------------#
#                      Configure Bind                      #
#----------------------------------------------------------#

if [ "$named" = 'yes' ]; then
    wget $vestacp/bind/named.conf -O /etc/bind/named.conf
    sed -i "s%listen-on%//listen%" /etc/bind/named.conf.options
    chown root:bind /etc/bind/named.conf
    chmod 640 /etc/bind/named.conf
    #update-rc.d bind9 defaults
    service bind9 start
    #check_result $? "bind9 start failed"
fi


#----------------------------------------------------------#
#                      Configure Exim                      #
#----------------------------------------------------------#

if [ "$exim" = 'yes' ]; then
    gpasswd -a Debian-exim mail
    wget $vestacp/exim/exim4.conf.template -O /etc/exim4/exim4.conf.template
    wget $vestacp/exim/dnsbl.conf -O /etc/exim4/dnsbl.conf
    wget $vestacp/exim/spam-blocks.conf -O /etc/exim4/spam-blocks.conf
    touch /etc/exim4/white-blocks.conf

    chmod 640 /etc/exim4/exim4.conf.template
    rm -rf /etc/exim4/domains
    mkdir -p /etc/exim4/domains

    rm -f /etc/alternatives/mta
    ln -s /usr/sbin/exim4 /etc/alternatives/mta
    #update-rc.d -f sendmail remove > /dev/null 2>&1
    service sendmail stop > /dev/null 2>&1
    #update-rc.d -f postfix remove > /dev/null 2>&1
    service postfix stop > /dev/null 2>&1
fi


#----------------------------------------------------------#
#                     Configure Dovecot                    #
#----------------------------------------------------------#

if [ "$dovecot" = 'yes' ]; then
    gpasswd -a dovecot mail
    wget $vestacp/dovecot.tar.gz -O /etc/dovecot.tar.gz
    cd /etc
    rm -rf dovecot dovecot.conf
    tar -xzf dovecot.tar.gz
    rm -f dovecot.tar.gz
    chown -R root:root /etc/dovecot*
fi


#----------------------------------------------------------#
#                   Configure Admin User                   #
#----------------------------------------------------------#

# Deleting old admin user
if [ ! -z "$(grep ^admin: /etc/passwd)" ] && [ "$force" = 'yes' ]; then
    chattr -i /home/admin/conf > /dev/null 2>&1
    userdel -f admin >/dev/null 2>&1
    chattr -i /home/admin/conf >/dev/null 2>&1
    rm -f /tmp/sess_* >/dev/null 2>&1
fi
if [ ! -z "$(grep ^admin: /etc/group)" ] && [ "$force" = 'yes' ]; then
    groupdel admin > /dev/null 2>&1
fi

# Adding vesta account
$VESTA/bin/v-add-user admin $vpass $email default System Administrator
$VESTA/bin/v-change-user-shell admin bash
$VESTA/bin/v-change-user-language admin $lang

# Configuring system ips
$VESTA/bin/v-update-sys-ip

# Get main ip
ip=$(ip addr|grep 'inet '|grep global|head -n1|awk '{print $2}'|cut -f1 -d/)

# Get public ip
pub_ip=$(wget vestacp.com/what-is-my-ip/ -O - 2>/dev/null)
if [ ! -z "$pub_ip" ] && [ "$pub_ip" != "$ip" ]; then
    $VESTA/bin/v-change-sys-ip-nat $ip $pub_ip
fi
if [ -z "$pub_ip" ]; then
    ip=$main_ip
fi

# Configuring mysql host
if [ "$mysql" = 'yes' ]; then
    $VESTA/bin/v-add-database-host mysql localhost root $vpass
    $VESTA/bin/v-add-database admin default default $(gen_pass) mysql
fi

# Configuring pgsql host
if [ "$postgresql" = 'yes' ]; then
    $VESTA/bin/v-add-database-host pgsql localhost postgres $vpass
    $VESTA/bin/v-add-database admin db db $(gen_pass) pgsql
fi

# Adding default domain
$VESTA/bin/v-add-domain admin $servername
check_result $? "can't create $servername domain"

# Adding cron jobs
command='sudo /usr/local/vesta/bin/v-update-sys-queue disk'
$VESTA/bin/v-add-cron-job 'admin' '15' '02' '*' '*' '*' "$command"
command='sudo /usr/local/vesta/bin/v-update-sys-queue traffic'
$VESTA/bin/v-add-cron-job 'admin' '10' '00' '*' '*' '*' "$command"
command='sudo /usr/local/vesta/bin/v-update-sys-queue webstats'
$VESTA/bin/v-add-cron-job 'admin' '30' '03' '*' '*' '*' "$command"
command='sudo /usr/local/vesta/bin/v-update-sys-queue backup'
$VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command"
command='sudo /usr/local/vesta/bin/v-backup-users'
$VESTA/bin/v-add-cron-job 'admin' '10' '05' '*' '*' '*' "$command"
command='sudo /usr/local/vesta/bin/v-update-user-stats'
$VESTA/bin/v-add-cron-job 'admin' '20' '00' '*' '*' '*' "$command"
command='sudo /usr/local/vesta/bin/v-update-sys-rrd'
$VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command"

# Building inititall rrd images
$VESTA/bin/v-update-sys-rrd

# Enabling file system quota
if [ "$quota" = 'yes' ]; then
    $VESTA/bin/v-add-sys-quota
fi


# Adding notifications
$VESTA/upd/add_notifications.sh