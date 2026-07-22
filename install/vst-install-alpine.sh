#!/bin/bash

# Vesta Alpine installer v.05 (MVP)
#
# This is a first cut of Alpine support: nginx + php-fpm (backend) + MariaDB
# + the Vesta panel itself. Apache, Exim/Dovecot mail, Bind DNS, vsftpd/
# ProFTPD, ClamAV/SpamAssassin, PostgreSQL, Fail2ban and Roundcube webmail
# are not wired up yet -- some of these (Roundcube, phpPgAdmin) aren't even
# packaged for Alpine and will need a different approach later.
#
# Unlike the other installers, there is no "vesta" apk package -- this repo
# checkout IS the panel, so this script copies itself into $VESTA instead of
# installing a distro package for it.

#----------------------------------------------------------#
#                  Variables&Functions                     #
#----------------------------------------------------------#
export PATH=$PATH:/sbin:/usr/sbin
export HOME=/root
VESTA='/usr/local/vesta'
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION='alpine'
memory=$(grep 'MemTotal' /proc/meminfo |tr ' ' '\n' |grep [0-9])
arch=$(uname -m)
os='alpine'
release=$(cut -d. -f1,2 /etc/alpine-release 2>/dev/null)
vestacp="$VESTA/install/$VERSION/$release"

# Defining software pack (MVP: nginx + php-fpm + MariaDB only)
software="nginx php83 php83-fpm php83-cli php83-ctype php83-curl php83-dom
    php83-fileinfo php83-gd php83-iconv php83-mbstring php83-mysqli
    php83-opcache php83-openssl php83-pdo php83-pdo_mysql php83-phar
    php83-session php83-simplexml php83-tokenizer php83-xml php83-xmlwriter
    php83-zip mariadb mariadb-client shadow sudo bash coreutils findutils
    grep sed gawk procps util-linux tzdata rsync curl wget git zip unzip
    openssl dcron iproute2 logrotate"

# Defining help function
help() {
    echo "Usage: $0 [OPTIONS]
  -m, --mysql             Install MariaDB          [yes|no]  default: yes
  -l, --lang              Default language                default: en
  -y, --interactive       Interactive install      [yes|no]  default: yes
  -s, --hostname          Set hostname
  -e, --email             Set admin email
  -d, --port              Set Vesta port
  -p, --password          Set admin password
  -f, --force             Force installation
  -h, --help              Print this help

  Only nginx + php-fpm + MariaDB are supported on Alpine right now; the
  Apache/mail/DNS/FTP/antivirus/Fail2ban options the other installers have
  aren't offered here yet.

  Example: bash $0 -e demo@vestacp.com -p p4ssw0rd"
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

# Defining function to set default language value
set_default_lang() {
    if [ -z "$lang" ]; then
        eval lang=$1
    fi
    lang_list="
        ar cz el fa hu ja no pt se ua
        bs da en fi id ka pl ro tr vi
        cn de es fr it nl pt-BR ru tw
        bg ko sr th ur"
    if !(echo $lang_list |grep -w $lang 1>&2>/dev/null); then
        eval lang=$1
    fi
}


#----------------------------------------------------------#
#                    Verifications                         #
#----------------------------------------------------------#

# Translating argument to --gnu-long-options
for arg; do
    delim=""
    case "$arg" in
        --mysql)                args="${args}-m " ;;
        --lang)                 args="${args}-l " ;;
        --interactive)          args="${args}-y " ;;
        --hostname)             args="${args}-s " ;;
        --email)                args="${args}-e " ;;
        --port)                 args="${args}-d " ;;
        --password)             args="${args}-p " ;;
        --force)                args="${args}-f " ;;
        --help)                 args="${args}-h " ;;
        *)                      [[ "${arg:0:1}" == "-" ]] || delim="\""
                                args="${args}${delim}${arg}${delim} ";;
    esac
done
eval set -- "$args"

# Parsing arguments
while getopts "m:l:y:s:e:d:p:fh" Option; do
    case $Option in
        m) mysql=$OPTARG ;;             # MariaDB
        l) lang=$OPTARG ;;              # Language
        y) interactive=$OPTARG ;;       # Interactive install
        s) servername=$OPTARG ;;        # Hostname
        e) email=$OPTARG ;;             # Admin email
        d) port=$OPTARG ;;              # Vesta port
        p) vpass=$OPTARG ;;             # Admin password
        f) force='yes' ;;               # Force install
        h) help ;;                      # Help
        *) help ;;                      # Print help (default)
    esac
done

# Defining default software stack
set_default_value 'mysql' 'yes'
set_default_value 'interactive' 'yes'
set_default_lang 'en'

# Checking root permissions
if [ "x$(id -u)" != 'x0' ]; then
    check_result 1 "Script can be run executed only by root"
fi

# Checking this is actually Alpine
if [ ! -e /etc/alpine-release ]; then
    check_result 1 "This installer is for Alpine Linux only"
fi

# Checking admin user account
if [ ! -z "$(grep ^admin: /etc/passwd)" ] && [ -z "$force" ]; then
    echo 'Please remove admin user account before proceeding.'
    echo 'If you want to do it automatically run installer with -f option:'
    echo -e "Example: bash $0 --force\n"
    check_result 1 "User admin exists"
fi

# Checking conflicts
conflicts=""
for pkg in nginx mariadb vesta; do
    if apk info -e "$pkg" >/dev/null 2>&1; then
        conflicts="$pkg $conflicts"
    fi
done
if [ ! -z "$conflicts" ] && [ -z "$force" ]; then
    echo '!!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!!'
    echo
    echo 'Following packages are already installed:'
    echo "$conflicts"
    echo
    echo 'It is highly recommended to remove them before proceeding.'
    echo 'If you want to force installation run this script with -f option:'
    echo "Example: bash $0 --force"
    echo
    echo '!!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!!'
    echo
    check_result 1 "Control Panel should be installed on clean server."
fi


#----------------------------------------------------------#
#                       Brief Info                         #
#----------------------------------------------------------#

# Printing nice ASCII logo
clear
echo
echo ' _|      _|  _|_|_|_|    _|_|_|  _|_|_|_|_|    _|_|'
echo ' _|      _|  _|        _|            _|      _|    _|'
echo ' _|      _|  _|_|_|      _|_|        _|      _|_|_|_|'
echo '   _|  _|    _|              _|      _|      _|    _|'
echo '     _|      _|_|_|_|  _|_|_|        _|      _|    _|'
echo
echo '                                  Vesta Control Panel'
echo -e "\n\n"

echo 'The following software will be installed on your system:'
echo '   - Nginx Web Server'
echo '   - PHP-FPM Application Server'
if [ "$mysql" = 'yes' ]; then
    echo '   - MariaDB Database Server'
fi
echo -e "\n\n"

# Asking for confirmation to proceed
if [ "$interactive" = 'yes' ]; then
    read -p 'Would you like to continue [y/n]: ' answer
    if [ "$answer" != 'y' ] && [ "$answer" != 'Y'  ]; then
        echo 'Goodbye'
        exit 1
    fi

    # Asking for contact email
    if [ -z "$email" ]; then
        read -p 'Please enter admin email address: ' email
    fi

    # Asking for Vesta port
    if [ -z "$port" ]; then
        read -p 'Please enter Vesta port number (press enter for 8083): ' port
    fi

    # Asking to set FQDN hostname
    if [ -z "$servername" ]; then
        read -p "Please enter FQDN hostname [$(hostname -f)]: " servername
    fi
fi

# Generating admin password if it wasn't set
if [ -z "$vpass" ]; then
    vpass=$(gen_pass)
fi

# Set hostname if it wasn't set
if [ -z "$servername" ]; then
    servername=$(hostname -f)
fi

# Set FQDN if it wasn't set
mask1='(([[:alnum:]](-?[[:alnum:]])*)\.)'
mask2='*[[:alnum:]](-?[[:alnum:]])+\.[[:alnum:]]{2,}'
if ! [[ "$servername" =~ ^${mask1}${mask2}$ ]]; then
    if [ ! -z "$servername" ]; then
        servername="$servername.example.com"
    else
        servername="example.com"
    fi
    echo "127.0.0.1 $servername" >> /etc/hosts
fi

# Set email if it wasn't set
if [ -z "$email" ]; then
    email="admin@$servername"
fi

# Set port if it wasn't set
if [ -z "$port" ]; then
    port="8083"
fi

# Printing start message and sleeping for 5 seconds
echo -e "\n\n\n\nInstallation will take a few minutes ...\n"
sleep 5


#----------------------------------------------------------#
#                     Install packages                     #
#----------------------------------------------------------#

# Excluding MariaDB if not wanted
if [ "$mysql" = 'no' ]; then
    software=$(echo "$software" | sed -e 's/mariadb-client//' -e 's/mariadb//' -e 's/php83-mysqli//' -e 's/php83-pdo_mysql//')
fi

apk update
check_result $? "apk update failed"

apk add --no-cache $software
check_result $? "apk add failed"

# Installing Vesta itself -- there's no apk package for it, this repo
# checkout is the panel, so copy it into place directly.
if [ "$REPO_ROOT" != "$VESTA" ]; then
    mkdir -p "$VESTA"
    rsync -a --exclude='.git' --exclude='.github' "$REPO_ROOT"/ "$VESTA"/
    check_result $? "vesta copy to $VESTA failed"
fi


#----------------------------------------------------------#
#                     Configure Vesta                      #
#----------------------------------------------------------#

# Vesta's own bin/v-restart-* scripts hardcode the Debian/RHEL "service"
# wrapper (e.g. "service $WEB_SYSTEM restart"). That command doesn't exist
# on Alpine, which uses OpenRC's rc-service directly -- so provide a thin
# compatibility shim. "configtest" isn't a standard OpenRC action; it's
# only used for a best-effort diagnostic email body, so fall back to
# checkconfig (what nginx's init script calls it) and don't treat failure
# as fatal.
cat > /usr/sbin/service <<'EOF'
#!/bin/sh
svc="$1"; action="$2"
case "$action" in
    configtest) rc-service "$svc" checkconfig 2>/dev/null; exit $? ;;
    *) exec rc-service "$svc" "$action" ;;
esac
EOF
chmod +x /usr/sbin/service

# Installing sudo configuration
mkdir -p /etc/sudoers.d
cp -f $vestacp/sudo/admin /etc/sudoers.d/
chmod 440 /etc/sudoers.d/admin
sed -i "s/%admin.*ALL=(ALL).*/# sudo is limited to vesta scripts/" /etc/sudoers

# Configuring system env
echo "export VESTA='$VESTA'" > /etc/profile.d/vesta.sh
chmod 755 /etc/profile.d/vesta.sh
source /etc/profile.d/vesta.sh
echo 'PATH=$PATH:'$VESTA'/bin' >> /root/.bash_profile
echo 'export PATH' >> /root/.bash_profile
source /root/.bash_profile

# Configuring logrotate for Vesta logs
mkdir -p /etc/logrotate.d
cp -f $vestacp/logrotate/vesta /etc/logrotate.d/

# Building directory tree and creating some blank files for Vesta
mkdir -p $VESTA/conf $VESTA/log $VESTA/ssl $VESTA/data/ips \
    $VESTA/data/queue $VESTA/data/users $VESTA/data/firewall \
    $VESTA/data/sessions
touch $VESTA/data/queue/backup.pipe $VESTA/data/queue/disk.pipe \
    $VESTA/data/queue/webstats.pipe $VESTA/data/queue/restart.pipe \
    $VESTA/data/queue/traffic.pipe $VESTA/log/system.log \
    $VESTA/log/nginx-error.log $VESTA/log/auth.log
chmod 750 $VESTA/conf $VESTA/data/users $VESTA/data/ips $VESTA/log
chmod -R 750 $VESTA/data/queue
chmod 660 $VESTA/log/*
rm -f /var/log/vesta
ln -s $VESTA/log /var/log/vesta
chmod 770 $VESTA/data/sessions

# Generating Vesta configuration
rm -f $VESTA/conf/vesta.conf 2>/dev/null
touch $VESTA/conf/vesta.conf
chmod 660 $VESTA/conf/vesta.conf

# Web stack (nginx + php-fpm only)
echo "WEB_SYSTEM='nginx'" >> $VESTA/conf/vesta.conf
echo "WEB_PORT='80'" >> $VESTA/conf/vesta.conf
echo "WEB_SSL_PORT='443'" >> $VESTA/conf/vesta.conf
echo "WEB_SSL='openssl'"  >> $VESTA/conf/vesta.conf
echo "WEB_BACKEND='php-fpm'" >> $VESTA/conf/vesta.conf

# Cron daemon
echo "CRON_SYSTEM='crond'" >> $VESTA/conf/vesta.conf

# Backups
echo "BACKUP_SYSTEM='local'" >> $VESTA/conf/vesta.conf

# Language
echo "LANGUAGE='$lang'" >> $VESTA/conf/vesta.conf

# Version
echo "VERSION='0.9.8'" >> $VESTA/conf/vesta.conf

# Installing hosting packages
cp -rf $vestacp/packages $VESTA/data/

# Installing templates
cp -rf $vestacp/templates $VESTA/data/

# Copying index.html to default documentroot
mkdir -p /var/www
cp $VESTA/data/templates/web/skel/public_html/index.html /var/www/
sed -i 's/%domain%/It worked!/g' /var/www/index.html

# Installing firewall rules (not enforced yet -- iptables isn't wired up on
# Alpine in this MVP, this just keeps the data files present for later)
cp -rf $vestacp/firewall $VESTA/data/

# Configuring server hostname
$VESTA/bin/v-change-sys-hostname $servername 2>/dev/null

# Generating SSL certificate
$VESTA/bin/v-generate-ssl-cert $(hostname) $email 'US' 'California' \
     'San Francisco' 'Vesta Control Panel' 'IT' > /tmp/vst.pem

# Parsing certificate file. OpenSSL 3.x emits PKCS#8 "BEGIN/END PRIVATE
# KEY" instead of the older PKCS#1 "BEGIN/END RSA PRIVATE KEY", so match
# either.
crt_end=$(grep -n "END CERTIFICATE-" /tmp/vst.pem |head -n1 |cut -f 1 -d:)
key_start=$(grep -n "BEGIN.*PRIVATE KEY" /tmp/vst.pem |head -n1 |cut -f 1 -d:)
key_end=$(grep -n "END.*PRIVATE KEY" /tmp/vst.pem |head -n1 |cut -f 1 -d:)

# Adding SSL certificate
cd $VESTA/ssl
sed -n "1,${crt_end}p" /tmp/vst.pem > certificate.crt
sed -n "$key_start,${key_end}p" /tmp/vst.pem > certificate.key
chown root:root $VESTA/ssl/*
chmod 660 $VESTA/ssl/*
rm /tmp/vst.pem

# Registering nologin as a valid system shell
if [ -z "$(grep nologin /etc/shells 2>/dev/null)" ]; then
    echo "/sbin/nologin" >> /etc/shells
fi


#----------------------------------------------------------#
#                     Configure Nginx                      #
#----------------------------------------------------------#

mkdir -p /etc/nginx/conf.d /var/log/nginx/domains /var/cache/nginx
rm -f /etc/nginx/http.d/default.conf 2>/dev/null
cp -f $vestacp/nginx/nginx.conf /etc/nginx/
cp -f $vestacp/nginx/status.conf /etc/nginx/conf.d/
cp -f $vestacp/logrotate/nginx /etc/logrotate.d/
echo > /etc/nginx/conf.d/vesta.conf
chown -R nginx:nginx /var/log/nginx /var/cache/nginx
rc-update add nginx default
rc-service nginx start
check_result $? "nginx start failed"


#----------------------------------------------------------#
#                     Configure PHP-FPM                    #
#----------------------------------------------------------#

cp -f $vestacp/php-fpm/www.conf /etc/php83/php-fpm.d/www.conf
# Note: the "vesta" pool (php-fpm/vesta.conf) isn't dropped in here -- it
# runs as the "admin" system user, which doesn't exist yet at this point in
# the install. It's added later, in the "Configure Vesta Panel" section
# after v-add-user creates that account.

# A couple of Vesta's own scripts (web/inc/mail-wrapper.php,
# bin/v-generate-password-hash) hardcode "#!/usr/local/vesta/php/bin/php"
# as their shebang -- on Debian/Ubuntu that path comes from the vesta-php
# package. We're using Alpine's own php83 for everything, so just point
# that path at it.
mkdir -p $VESTA/php/bin
ln -sf /usr/bin/php83 $VESTA/php/bin/php

rc-update add php-fpm83 default
rc-service php-fpm83 start
check_result $? "php-fpm start failed"

ZONE=$(cat /etc/timezone 2>/dev/null)
if [ -z "$ZONE" ]; then
    ZONE='UTC'
fi
for pconf in /etc/php83/php.ini /etc/php83/cli/php.ini; do
    [ -e "$pconf" ] || continue
    sed -i "s%;date.timezone =%date.timezone = $ZONE%g" $pconf
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

    # Configuring MariaDB
    mkdir -p /var/log/mysql
    chown mysql:mysql /var/log/mysql
    cp -f $vestacp/mysql/$mycnf /etc/my.cnf.d/vesta.cnf

    mkdir -p /run/mysqld
    chown mysql:mysql /run/mysqld
    if [ ! -d /var/lib/mysql/mysql ]; then
        mariadb-install-db --user=mysql --datadir=/var/lib/mysql
        check_result $? "mariadb-install-db failed"
    fi
    rc-update add mariadb default
    rc-service mariadb start
    check_result $? "mariadb start failed"

    # Securing MariaDB installation
    mpass=$(gen_pass)
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$mpass';"
    check_result $? "mysql root password setup failed"
    echo -e "[client]\npassword='$mpass'\n" > /root/.my.cnf
    chmod 600 /root/.my.cnf
    mysql -e "DELETE FROM mysql.user WHERE User=''"
    mysql -e "DROP DATABASE test" >/dev/null 2>&1
    mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%'"
    mysql -e "DELETE FROM mysql.user WHERE user='' OR authentication_string='';" 2>/dev/null
    mysql -e "FLUSH PRIVILEGES"
fi


#----------------------------------------------------------#
#                     Configure cron                       #
#----------------------------------------------------------#

rc-update add dcron default
rc-service dcron start
check_result $? "dcron start failed"


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
if [ ! -z "$(grep ^admin: /etc/group)" ]; then
    groupdel admin > /dev/null 2>&1
fi

# Adding vesta account
$VESTA/bin/v-add-user admin $vpass $email default System Administrator
check_result $? "can't create admin user"
$VESTA/bin/v-change-user-shell admin bash
$VESTA/bin/v-change-user-language admin $lang


#----------------------------------------------------------#
#                  Configure Vesta Panel                   #
#----------------------------------------------------------#

# The admin panel UI (port 8083) runs as a second, dedicated nginx instance
# separate from the one serving hosted domains -- this needs the "admin"
# user to already exist (nginx workers run as it), so it has to happen
# after v-add-user above. On Debian/Ubuntu this is the "vesta-nginx"
# binary; here it's just a second instance of Alpine's own nginx, wired up
# as an OpenRC service named "vesta" (matching what Vesta's own
# bin/v-restart-* scripts already expect to find).
mkdir -p $VESTA/nginx/conf
cp -f $vestacp/nginx/vesta-panel.conf $VESTA/nginx/conf/nginx.conf
cp -f $vestacp/php-fpm/vesta.conf /etc/php83/php-fpm.d/vesta.conf
# Not a symlink to /etc/init.d/nginx: that script hardcodes its pidfile
# path instead of reading it from conf.d, so a symlinked instance never
# gets its own /run directory created by checkpath. Deploy a standalone
# init script instead (see install/alpine/3.24/nginx/vesta.initd).
cp -f $vestacp/nginx/vesta.initd /etc/init.d/vesta
chmod 755 /etc/init.d/vesta
rc-service php-fpm83 restart
check_result $? "php-fpm restart failed"
rc-update add vesta default
rc-service vesta start
check_result $? "vesta start failed"

# Configuring system ips
$VESTA/bin/v-update-sys-ip

# Get main ip
ip=$(ip addr|grep 'inet '|grep global|head -n1|awk '{print $2}'|cut -f1 -d/)
local_ip=$ip

# Get public ip
pub_ip=$(curl -s vestacp.com/what-is-my-ip/)
if ! [[ "$pub_ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    pub_ip=""
fi

if [ ! -z "$pub_ip" ] && [ "$pub_ip" != "$ip" ]; then
    $VESTA/bin/v-change-sys-ip-nat $ip $pub_ip
    ip=$pub_ip
fi

# Configuring mysql host
if [ "$mysql" = 'yes' ]; then
    $VESTA/bin/v-add-database-host mysql localhost root $mpass
    $VESTA/bin/v-add-database admin default default $(gen_pass) mysql
fi

# Adding default domain
$VESTA/bin/v-add-domain admin $servername
check_result $? "can't create $servername domain"

# Adding cron jobs
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

# Building initial rrd images
$VESTA/bin/v-update-sys-rrd

# Note: unlike the other installers, there's no "vesta" daemon/init-script
# to start here -- the panel is just a PHP app served by nginx + php-fpm,
# both already running at this point.
chown admin:admin $VESTA/data/sessions

# Adding notifications
$VESTA/upd/add_notifications.sh

# Adding cronjob for autoupdates
$VESTA/bin/v-add-cron-vesta-autoupdate

if [ "$port" != "8083" ]; then
    echo "=== Set Vesta port: $port"
    $VESTA/bin/v-change-vesta-port $port
fi

echo "NOTIFY_ADMIN_FULL_BACKUP='$email'" >> $VESTA/conf/vesta.conf


#----------------------------------------------------------#
#                   Vesta Access Info                      #
#----------------------------------------------------------#

host_ip=$(host $servername 2>/dev/null |head -n 1 |awk '{print $NF}')
if [ "$host_ip" = "$ip" ]; then
    ip="$servername"
fi

echo -e "Congratulations, you have just successfully installed \
Vesta Control Panel

    https://$ip:$port
    username: admin
    password: $vpass

This is an MVP Alpine install -- nginx, php-fpm and MariaDB only. Mail, DNS,
FTP, antivirus and Fail2ban support are not available on Alpine yet.
"

# Congrats
echo '======================================================='
echo
echo ' _|      _|  _|_|_|_|    _|_|_|  _|_|_|_|_|    _|_|   '
echo ' _|      _|  _|        _|            _|      _|    _| '
echo ' _|      _|  _|_|_|      _|_|        _|      _|_|_|_| '
echo '   _|  _|    _|              _|      _|      _|    _| '
echo '     _|      _|_|_|_|  _|_|_|        _|      _|    _| '
echo
echo "https://$ip:$port"
echo "username: admin"
echo "password: $vpass"
echo

# EOF
