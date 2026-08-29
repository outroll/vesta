#!/bin/bash

# Vesta Alpine installer
#
# nginx (default) or Apache, php-fpm/mod_php, MariaDB, vsftpd/ProFTPD,
# Bind, Exim + Dovecot (+ ClamAV/SpamAssassin), iptables + Fail2ban,
# phpMyAdmin and Roundcube webmail -- everything the other installers
# offer except PostgreSQL/phpPgAdmin, which aren't wired up here yet.
#
# Roundcube has no apk package, so it's fetched as a version-pinned,
# checksum-verified upstream release tarball instead (see the Roundcube
# section below) -- the same "not a distro package" pattern already used
# for Vesta itself.
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

# Roundcube release pinning -- see the "Configure Roundcube" section.
ROUNDCUBE_VERSION='1.6.17'
ROUNDCUBE_SHA256='e1f6c437959cb8dffda1a3e59f0c0a2160b3d669948db69bb02edb218c8e69a1'

# Defining software pack for all distros
software="openrc nginx php83 php83-fpm php83-cli php83-ctype php83-curl php83-dom
    php83-fileinfo php83-gd php83-iconv php83-mbstring php83-mysqli
    php83-opcache php83-openssl php83-pdo php83-pdo_mysql php83-phar
    php83-session php83-simplexml php83-tokenizer php83-xml php83-xmlwriter
    php83-zip mariadb mariadb-client shadow sudo bash coreutils findutils
    grep sed gawk procps util-linux tzdata rsync curl wget git zip unzip
    openssl dcron iproute2 logrotate libidn"

# Defining help function
help() {
    echo "Usage: $0 [OPTIONS]
  -a, --apache             Install Apache           [yes|no]  default: no
  -v, --vsftpd             Install vsftpd            [yes|no]  default: yes
  -j, --proftpd            Install ProFTPD           [yes|no]  default: no
  -k, --named              Install Bind              [yes|no]  default: yes
  -m, --mysql              Install MariaDB           [yes|no]  default: yes
  -x, --exim               Install Exim              [yes|no]  default: yes
  -z, --dovecot            Install Dovecot           [yes|no]  default: yes
  -c, --clamav             Install ClamAV            [yes|no]  default: yes on hosts with >=1.5G RAM
  -t, --spamassassin       Install SpamAssassin      [yes|no]  default: yes on hosts with >=1.5G RAM
  -i, --iptables           Install iptables          [yes|no]  default: yes
  -b, --fail2ban           Install Fail2ban          [yes|no]  default: yes
  -l, --lang               Default language                default: en
  -y, --interactive        Interactive install      [yes|no]  default: yes
  -s, --hostname           Set hostname
  -e, --email              Set admin email
  -d, --port               Set Vesta port
  -p, --password           Set admin password
  -f, --force               Force installation
  -h, --help                Print this help

  nginx + php-fpm stays the default web backend; pass --apache yes to also
  (or instead, with --nginx no if you've scripted this differently) enable
  Apache with mod_php. PostgreSQL/phpPgAdmin aren't offered here yet.
  phpMyAdmin is installed automatically whenever --mysql is yes; Roundcube
  webmail is installed automatically whenever both --exim and --mysql are
  yes (fetched as a pinned upstream tarball -- see ROUNDCUBE_VERSION in
  this script).

  Example: bash $0 -e demo@vestacp.com -p p4ssw0rd --apache yes"
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
        --apache)               args="${args}-a " ;;
        --vsftpd)               args="${args}-v " ;;
        --proftpd)              args="${args}-j " ;;
        --named)                args="${args}-k " ;;
        --mysql)                args="${args}-m " ;;
        --exim)                 args="${args}-x " ;;
        --dovecot)              args="${args}-z " ;;
        --clamav)                args="${args}-c " ;;
        --spamassassin)         args="${args}-t " ;;
        --iptables)             args="${args}-i " ;;
        --fail2ban)             args="${args}-b " ;;
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
while getopts "a:v:j:k:m:x:z:c:t:i:b:l:y:s:e:d:p:fh" Option; do
    case $Option in
        a) apache=$OPTARG ;;            # Apache
        v) vsftpd=$OPTARG ;;            # vsftpd
        j) proftpd=$OPTARG ;;           # ProFTPD
        k) named=$OPTARG ;;             # Bind
        m) mysql=$OPTARG ;;             # MariaDB
        x) exim=$OPTARG ;;              # Exim
        z) dovecot=$OPTARG ;;           # Dovecot
        c) clamav=$OPTARG ;;            # ClamAV
        t) spamassassin=$OPTARG ;;      # SpamAssassin
        i) iptables=$OPTARG ;;          # iptables
        b) fail2ban=$OPTARG ;;          # Fail2ban
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
set_default_value 'apache' 'no'
set_default_value 'vsftpd' 'yes'
set_default_value 'proftpd' 'no'
set_default_value 'named' 'yes'
set_default_value 'mysql' 'yes'
set_default_value 'exim' 'yes'
set_default_value 'dovecot' 'yes'
if [ $memory -lt 1500000 ]; then
    set_default_value 'clamav' 'no'
    set_default_value 'spamassassin' 'no'
else
    set_default_value 'clamav' 'yes'
    set_default_value 'spamassassin' 'yes'
fi
set_default_value 'iptables' 'yes'
set_default_value 'fail2ban' 'yes'
set_default_value 'interactive' 'yes'
set_default_lang 'en'

# Checking software conflicts
if [ "$proftpd" = 'yes' ]; then
    vsftpd='no'
fi
if [ "$exim" = 'no' ]; then
    clamav='no'
    spamassassin='no'
    dovecot='no'
fi
if [ "$iptables" = 'no' ]; then
    fail2ban='no'
fi

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
for pkg in nginx mariadb vesta apache2 bind exim dovecot vsftpd proftpd; do
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
if [ "$apache" = 'yes' ]; then
    echo '   - Apache Web Server'
fi
echo '   - PHP Application Server'
if [ "$mysql" = 'yes' ]; then
    echo '   - MariaDB Database Server'
    echo '   - phpMyAdmin'
fi
if [ "$vsftpd" = 'yes' ]; then
    echo '   - Vsftpd FTP Server'
fi
if [ "$proftpd" = 'yes' ]; then
    echo '   - ProFTPD FTP Server'
fi
if [ "$named" = 'yes' ]; then
    echo '   - Bind DNS Server'
fi
if [ "$exim" = 'yes' ]; then
    echo '   - Exim Mail Server'
fi
if [ "$dovecot" = 'yes' ]; then
    echo '   - Dovecot POP3/IMAP Server'
fi
if [ "$clamav" = 'yes' ]; then
    echo '   - ClamAV Antivirus'
fi
if [ "$spamassassin" = 'yes' ]; then
    echo '   - SpamAssassin Antispam'
fi
if [ "$exim" = 'yes' ] && [ "$mysql" = 'yes' ]; then
    echo '   - Roundcube Webmail'
fi
if [ "$iptables" = 'yes' ]; then
    echo '   - iptables Firewall'
fi
if [ "$fail2ban" = 'yes' ]; then
    echo '   - Fail2ban'
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

# Web/FTP/DNS/mail/firewall stack, added on top of the base software list
if [ "$apache" = 'yes' ]; then
    software="$software apache2 apache2-ssl apache2-ctl php83-apache2"
fi
if [ "$vsftpd" = 'yes' ]; then
    software="$software vsftpd"
fi
if [ "$proftpd" = 'yes' ]; then
    software="$software proftpd"
fi
if [ "$named" = 'yes' ]; then
    software="$software bind"
fi
if [ "$exim" = 'yes' ]; then
    software="$software exim"
fi
if [ "$dovecot" = 'yes' ]; then
    software="$software dovecot dovecot-pop3d"
fi
if [ "$clamav" = 'yes' ]; then
    software="$software clamav-daemon freshclam"
fi
if [ "$spamassassin" = 'yes' ]; then
    software="$software spamassassin"
fi
if [ "$iptables" = 'yes' ]; then
    software="$software iptables"
fi
if [ "$fail2ban" = 'yes' ]; then
    software="$software fail2ban busybox-openrc"
fi
if [ "$mysql" = 'yes' ]; then
    software="$software phpmyadmin"
fi
if [ "$exim" = 'yes' ] && [ "$mysql" = 'yes' ]; then
    # Roundcube itself has no apk package (fetched separately below), but
    # it needs these to run.
    software="$software php83-intl php83-ldap php83-exif"
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

# bin/v-update-firewall (and bin/v-add-sys-ip, which calls it internally --
# so this has to be in place before v-update-sys-ip runs later, not just
# before the explicit v-update-firewall call in "Configure Admin User")
# hardcodes /sbin/iptables, /sbin/modprobe and /sbin/sysctl. Alpine's apk
# packages only provide these under /usr/sbin (no /sbin compat symlinks
# like Debian/RHEL have), so bridge that here instead of touching the
# shared script.
if [ "$iptables" = 'yes' ]; then
    for fw_bin in iptables iptables-save iptables-restore modprobe sysctl; do
        if [ ! -e "/sbin/$fw_bin" ] && [ -e "/usr/sbin/$fw_bin" ]; then
            ln -s "/usr/sbin/$fw_bin" "/sbin/$fw_bin"
        fi
    done
fi

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

# Web stack -- nginx is always installed as the base/panel-UI web server
# in this installer (there's no --nginx flag to turn it off), so "apache
# yes" always means the reverse-proxy combo: Apache on 8080/8443 behind
# nginx on 80/443.
if [ "$apache" = 'yes' ]; then
    echo "WEB_SYSTEM='apache2'" >> $VESTA/conf/vesta.conf
    echo "WEB_RGROUPS='apache'" >> $VESTA/conf/vesta.conf
    echo "WEB_PORT='8080'" >> $VESTA/conf/vesta.conf
    echo "WEB_SSL_PORT='8443'" >> $VESTA/conf/vesta.conf
    echo "WEB_SSL='mod_ssl'" >> $VESTA/conf/vesta.conf
    echo "PROXY_SYSTEM='nginx'" >> $VESTA/conf/vesta.conf
    echo "PROXY_PORT='80'" >> $VESTA/conf/vesta.conf
    echo "PROXY_SSL_PORT='443'" >> $VESTA/conf/vesta.conf
    echo "STATS_SYSTEM='webalizer,awstats'" >> $VESTA/conf/vesta.conf
else
    echo "WEB_SYSTEM='nginx'" >> $VESTA/conf/vesta.conf
    echo "WEB_PORT='80'" >> $VESTA/conf/vesta.conf
    echo "WEB_SSL_PORT='443'" >> $VESTA/conf/vesta.conf
    echo "WEB_SSL='openssl'"  >> $VESTA/conf/vesta.conf
    echo "WEB_BACKEND='php-fpm'" >> $VESTA/conf/vesta.conf
    echo "STATS_SYSTEM='webalizer,awstats'" >> $VESTA/conf/vesta.conf
fi

# FTP stack
if [ "$vsftpd" = 'yes' ]; then
    echo "FTP_SYSTEM='vsftpd'" >> $VESTA/conf/vesta.conf
fi
if [ "$proftpd" = 'yes' ]; then
    echo "FTP_SYSTEM='proftpd'" >> $VESTA/conf/vesta.conf
fi

# DNS stack -- Alpine's named init script (and bin/v-add-dns-domain's
# fallback branch) expects /etc/bind/named.conf, and its own package/group
# name is "named" (not Debian's "bind9"/"bind" convention).
if [ "$named" = 'yes' ]; then
    echo "DNS_SYSTEM='named'" >> $VESTA/conf/vesta.conf
fi

# Mail stack
if [ "$exim" = 'yes' ]; then
    echo "MAIL_SYSTEM='exim'" >> $VESTA/conf/vesta.conf
    if [ "$clamav" = 'yes' ]; then
        echo "ANTIVIRUS_SYSTEM='clamd'" >> $VESTA/conf/vesta.conf
    fi
    if [ "$spamassassin" = 'yes' ]; then
        echo "ANTISPAM_SYSTEM='spamd'" >> $VESTA/conf/vesta.conf
    fi
    if [ "$dovecot" = 'yes' ]; then
        echo "IMAP_SYSTEM='dovecot'" >> $VESTA/conf/vesta.conf
    fi
fi

# Cron daemon
echo "CRON_SYSTEM='dcron'" >> $VESTA/conf/vesta.conf

# Firewall stack
if [ "$iptables" = 'yes' ]; then
    echo "FIREWALL_SYSTEM='iptables'" >> $VESTA/conf/vesta.conf
fi
if [ "$iptables" = 'yes' ] && [ "$fail2ban" = 'yes' ]; then
    echo "FIREWALL_EXTENSION='fail2ban'" >> $VESTA/conf/vesta.conf
fi

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

# Installing firewall rules
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
if [ "$mysql" = 'yes' ]; then
    cp -f $vestacp/nginx/phpmyadmin.inc /etc/nginx/conf.d/
fi
if [ "$exim" = 'yes' ] && [ "$mysql" = 'yes' ]; then
    cp -f $vestacp/nginx/webmail.inc /etc/nginx/conf.d/
fi
cp -f $vestacp/logrotate/nginx /etc/logrotate.d/
echo > /etc/nginx/conf.d/vesta.conf
chown -R nginx:nginx /var/log/nginx /var/cache/nginx
rc-update add nginx default
rc-service nginx start
check_result $? "nginx start failed"


#----------------------------------------------------------#
#                     Configure Apache                     #
#----------------------------------------------------------#

if [ "$apache" = 'yes' ]; then
    # Alpine's apache2 build ships everything Vesta's templates need
    # already compiled in as commented-out LoadModule lines in httpd.conf
    # -- there's no a2enmod, so just uncomment them. mod_ssl comes from
    # the separate apache2-ssl package and self-registers via
    # conf.d/ssl.conf; mod_php comes from php83-apache2 the same way.
    # Unlike Debian, Alpine has no mod_fcgid/mod_suexec/mod_ruid2 package
    # at all, so only the mod_php-based templates (default/basedir/hosting)
    # work here -- the phpcgi/phpfcgid templates are not wired up.
    sed -i \
        -e 's/^#LoadModule rewrite_module/LoadModule rewrite_module/' \
        -e 's/^#LoadModule actions_module/LoadModule actions_module/' \
        -e 's/^#LoadModule cgi_module/LoadModule cgi_module/' \
        /etc/apache2/httpd.conf

    mkdir -p /etc/apache2/conf.d /var/log/apache2/domains
    cp -f $vestacp/apache2/status.conf /etc/apache2/conf.d/
    echo > /etc/apache2/conf.d/vesta.conf
    touch /var/log/apache2/access.log /var/log/apache2/error.log
    chown -R apache:apache /var/log/apache2

    # nginx is always installed as the base web server in this installer,
    # so Apache always runs in reverse-proxy mode: nginx keeps 80/443,
    # Apache moves to 8080/8443.
    sed -i 's/^Listen 80$/Listen 8080/' /etc/apache2/httpd.conf
    sed -i 's/^Listen 443$/Listen 8443/' /etc/apache2/conf.d/ssl.conf

    rc-update add apache2 default
    rc-service apache2 start
    check_result $? "apache2 start failed"
fi


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
for pconf in /etc/php83/php.ini /etc/php83/cli/php.ini /etc/php83/apache2/php.ini; do
    [ -e "$pconf" ] || continue
    sed -i "s%;date.timezone =%date.timezone = $ZONE%g" $pconf
    sed -i 's%_open_tag = Off%_open_tag = On%g' $pconf
done


#----------------------------------------------------------#
#                     Configure FTP                        #
#----------------------------------------------------------#

if [ "$vsftpd" = 'yes' ]; then
    mkdir -p /etc/vsftpd
    cp -f $vestacp/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf
    touch /var/log/vsftpd.log
    rc-update add vsftpd default
    rc-service vsftpd start
    check_result $? "vsftpd start failed"
fi

if [ "$proftpd" = 'yes' ]; then
    mkdir -p /etc/proftpd
    cp -f $vestacp/proftpd/proftpd.conf /etc/proftpd/proftpd.conf
    rc-update add proftpd default
    rc-service proftpd start
    check_result $? "proftpd start failed"
fi


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

    # Configuring phpMyAdmin -- Alpine's phpmyadmin package serves from
    # /usr/share/webapps/phpmyadmin (not Debian's /usr/share/phpmyadmin);
    # nginx's webroot alias for it was already dropped in above.
    blowfish=$(gen_pass)$(gen_pass)$(gen_pass)
    sed "s/%blowfish_secret%/$blowfish/" $vestacp/pma/config.inc.php \
        > /etc/phpmyadmin/config.inc.php
    if [ "$apache" = 'yes' ]; then
        echo "Alias /phpmyadmin /usr/share/webapps/phpmyadmin" \
            >> /etc/apache2/conf.d/vesta.conf
    fi
fi


#----------------------------------------------------------#
#                      Configure Bind                      #
#----------------------------------------------------------#

if [ "$named" = 'yes' ]; then
    mkdir -p /etc/bind /var/bind /run/named /var/log/named
    cp -f $vestacp/bind/named.conf /etc/bind/named.conf
    # Alpine's bind package/group is "named", but bin/v-add-dns-domain's
    # /etc/bind/named.conf branch (the one that applies here) hardcodes
    # "chown root:bind" on every zone file it creates -- add a "bind"
    # group and put the "named" user in it so that chown keeps working
    # without touching that shared script.
    addgroup bind 2>/dev/null
    adduser named bind 2>/dev/null
    chown root:named /etc/bind/named.conf
    chmod 640 /etc/bind/named.conf
    chown named:named /run/named /var/bind /var/log/named
    rc-update add named default
    rc-service named start
    check_result $? "named start failed"
fi


#----------------------------------------------------------#
#                      Configure Exim                      #
#----------------------------------------------------------#

if [ "$exim" = 'yes' ]; then
    mkdir -p /etc/exim
    cp -f $vestacp/exim/exim.conf /etc/exim/exim.conf
    cp -f $vestacp/exim/dnsbl.conf /etc/exim/dnsbl.conf
    cp -f $vestacp/exim/spam-blocks.conf /etc/exim/spam-blocks.conf
    touch /etc/exim/white-blocks.conf
    rm -rf /etc/exim/domains
    mkdir -p /etc/exim/domains

    # See exim.conf's ${lookup{...}lsearch*,ret=key{/etc/exim/detaint}}
    # uses -- Exim 4.94+ taint-tracks $local_part (it comes straight off
    # the SMTP envelope) and refuses to use it in a maildir path without
    # this. Needs to be world-readable: the local_delivery transport reads
    # it as the destination mailbox's own system user, not as exim.
    echo '*' > /etc/exim/detaint
    chmod 444 /etc/exim/detaint

    if [ "$spamassassin" = 'yes' ]; then
        sed -i "s/#SPAMASSASSIN/SPAMASSASSIN/g" /etc/exim/exim.conf
    fi
    if [ "$clamav" = 'yes' ]; then
        sed -i "s/#CLAMD/CLAMD/g" /etc/exim/exim.conf
    fi

    chown root:root /etc/exim/exim.conf
    chmod 644 /etc/exim/exim.conf

    rc-update add exim default
    rc-service exim start
    check_result $? "exim start failed"
fi


#----------------------------------------------------------#
#                     Configure Dovecot                    #
#----------------------------------------------------------#

if [ "$dovecot" = 'yes' ]; then
    mkdir -p /etc/dovecot
    cp -f $vestacp/dovecot/dovecot.conf /etc/dovecot/dovecot.conf
    rc-update add dovecot default
    rc-service dovecot start
    check_result $? "dovecot start failed"
fi


#----------------------------------------------------------#
#                     Configure ClamAV                     #
#----------------------------------------------------------#

if [ "$clamav" = 'yes' ]; then
    mkdir -p /var/log/clamav /run/clamav /var/lib/clamav
    cp -f $vestacp/clamav/clamd.conf /etc/clamav/clamd.conf
    cp -f $vestacp/clamav/freshclam.conf /etc/clamav/freshclam.conf
    chown -R clamav:clamav /var/log/clamav /run/clamav /var/lib/clamav
    freshclam
    rc-update add clamd default
    rc-update add freshclam default
    rc-service clamd start
    # Not fatal: the db update above can fail on a network-restricted
    # host, in which case clamd will (correctly) refuse to start until a
    # database exists.
fi


#----------------------------------------------------------#
#                  Configure SpamAssassin                  #
#----------------------------------------------------------#

if [ "$spamassassin" = 'yes' ]; then
    chmod o+rx /etc/mail
    mkdir -p /etc/mail/spamassassin
    cp -f $vestacp/spamassassin/local.cf /etc/mail/spamassassin/local.cf
    cp -f $vestacp/spamassassin/spamd.conf.d /etc/conf.d/spamd
    sa-update >/dev/null 2>&1
    rc-update add spamd default
    rc-service spamd start
    check_result $? "spamd start failed"
fi


#----------------------------------------------------------#
#                   Configure Roundcube                    #
#----------------------------------------------------------#

if [ "$exim" = 'yes' ] && [ "$mysql" = 'yes' ]; then
    rc_tarball="/tmp/roundcubemail-$ROUNDCUBE_VERSION-complete.tar.gz"
    curl -fsSL -o "$rc_tarball" \
        "https://github.com/roundcube/roundcubemail/releases/download/$ROUNDCUBE_VERSION/roundcubemail-$ROUNDCUBE_VERSION-complete.tar.gz"
    check_result $? "roundcube download failed"
    echo "$ROUNDCUBE_SHA256  $rc_tarball" | sha256sum -c -
    check_result $? "roundcube tarball checksum mismatch"

    rm -rf /var/lib/roundcube
    mkdir -p /var/lib/roundcube
    tar -xzf "$rc_tarball" -C /var/lib/roundcube --strip-components=1
    rm -f "$rc_tarball"

    rpass=$(gen_pass)
    deskey=$(gen_pass)$(gen_pass)$(head -c4 /dev/urandom |base64|head -c4)
    sed -e "s/%password%/$rpass/" -e "s/%des_key%/$deskey/" \
        $vestacp/roundcube/config.inc.php \
        > /var/lib/roundcube/config/config.inc.php
    cp -f $vestacp/roundcube/password.inc.php \
        /var/lib/roundcube/plugins/password/config.inc.php
    cp -f $vestacp/roundcube/vesta.php \
        /var/lib/roundcube/plugins/password/drivers/vesta.php

    mkdir -p /var/log/roundcube
    chown -R nginx:nginx /var/lib/roundcube/temp /var/lib/roundcube/logs \
        /var/log/roundcube 2>/dev/null
    chmod 640 /var/lib/roundcube/config/config.inc.php
    chown root:nginx /var/lib/roundcube/config/config.inc.php

    mysql -e "CREATE DATABASE roundcube"
    mysql -e "GRANT ALL ON roundcube.* TO roundcube@localhost IDENTIFIED BY '$rpass'"
    mysql roundcube < /var/lib/roundcube/SQL/mysql.initial.sql
fi


#----------------------------------------------------------#
#                     Configure cron                       #
#----------------------------------------------------------#

rc-update add dcron default
rc-service dcron start
check_result $? "dcron start failed"


#----------------------------------------------------------#
#                    Configure Fail2ban                    #
#----------------------------------------------------------#

if [ "$fail2ban" = 'yes' ]; then
    # fail2ban's init script needs the "logger" service (see the
    # busybox-openrc install above). busybox syslogd defaults to dumping
    # everything into one /var/log/messages with no facility split, but
    # the sshd jail below expects a real /var/log/auth.log -- point it at
    # a syslog.conf that splits the auth facility out, like every other
    # syslog implementation does by default.
    cp -f $vestacp/syslog/syslog.conf /etc/syslog.conf
    cp -f $vestacp/syslog/syslog.conf.d /etc/conf.d/syslog
    # fail2ban refuses to start if an enabled jail's logpath doesn't exist
    # yet -- true here on a fresh install for anything that only creates
    # its log file lazily on first write (busybox syslogd for
    # /var/log/auth.log; PHP's error_log for roundcube's).
    touch /var/log/auth.log
    if [ "$exim" = 'yes' ] && [ "$mysql" = 'yes' ]; then
        touch /var/log/roundcube/errors
        chown nginx:nginx /var/log/roundcube/errors
    fi
    rc-update add syslog default
    rc-service syslog start
    cp -f $vestacp/fail2ban/jail.local /etc/fail2ban/jail.local
    if [ "$vsftpd" = 'yes' ]; then
        sed -i '/^\[vsftpd\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    if [ "$proftpd" = 'yes' ]; then
        sed -i '/^\[proftpd\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    if [ "$dovecot" = 'yes' ]; then
        sed -i '/^\[dovecot\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    if [ "$exim" = 'yes' ]; then
        sed -i '/^\[exim\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
        sed -i '/^\[exim-spam\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    if [ "$named" = 'yes' ]; then
        sed -i '/^\[named-refused\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    if [ "$mysql" = 'yes' ]; then
        sed -i '/^\[mysqld-auth\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    if [ "$exim" = 'yes' ] && [ "$mysql" = 'yes' ]; then
        sed -i '/^\[roundcube-auth\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local
    fi
    sed -i '/^\[nginx-http-auth\]/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local

    rc-update add fail2ban default
    rc-service fail2ban start
    check_result $? "fail2ban start failed"
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

# Configuring firewall
if [ "$iptables" = 'yes' ]; then
    rc-update add iptables default
    $VESTA/bin/v-update-firewall
fi

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
