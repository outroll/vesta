#!/bin/bash

#########################################################################
# First enter 1 below for desired PHP versions and then run this script #
#########################################################################

inst_56=0
inst_70=0
inst_71=0
inst_72=0
inst_73=0
inst_74=0

#######################################################################

inst_repo=0
debian_version=$(cat /etc/debian_version | tr "." "\n" | head -n1)

if [ $# -gt 0 ]; then
    inst_repo=$1
fi
if [ $# -gt 1 ]; then
    inst_56=$2
fi
if [ $# -gt 2 ]; then
    inst_70=$3
fi
if [ $# -gt 3 ]; then
    inst_71=$4
fi
if [ $# -gt 4 ]; then
    inst_72=$5
fi
if [ $# -gt 5 ]; then
    inst_73=$6
fi
if [ $# -gt 6 ]; then
    inst_74=$7
fi

if [ $inst_56 -eq 1 ] || [ $inst_70 -eq 1 ] || [ $inst_71 -eq 1 ] || [ $inst_72 -eq 1 ] || [ $inst_73 -eq 1 ] || [ $inst_74 -eq 1 ]; then
    inst_repo=1
fi

wait_to_press_enter=0
if [ -f "/root/wait_to_press_enter" ]; then
  wait_to_press_enter=1
fi

function press_enter {
    if [ $wait_to_press_enter -eq 1 ]; then
        read -p "$1"
    else
        echo $1
    fi
}


# echo "parameters=$#"
echo "debian_version=$debian_version"
echo "inst_repo=$inst_repo"
echo "inst_56=$inst_56"
echo "inst_70=$inst_70"
echo "inst_71=$inst_71"
echo "inst_72=$inst_72"
echo "inst_73=$inst_73"
echo "inst_74=$inst_74"
echo "wait_to_press_enter=$wait_to_press_enter"

press_enter "=== Press enter to continue ==============================================================================="

apt-get update
if [ "$inst_repo" -eq 1 ]; then
press_enter "=== Press enter to install sury.org repo ==============================================================================="
apt-get -y install apt-transport-https ca-certificates
wget -nv -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
if [ $debian_version -eq 8 ]; then
  sh -c 'echo "deb https://packages.sury.org/php/ jessie main" > /etc/apt/sources.list.d/php.list'
fi
if [ $debian_version -eq 9 ]; then
  sh -c 'echo "deb https://packages.sury.org/php/ stretch main" > /etc/apt/sources.list.d/php.list'
fi
if [ $debian_version -eq 10 ]; then
  sh -c 'echo "deb https://packages.sury.org/php/ buster main" > /etc/apt/sources.list.d/php.list'
fi
apt-get update
apt-get upgrade -y
press_enter "=== Press enter to continue ==============================================================================="
fi

echo "=== Enabling proxy_fcgi setenvif"
a2enmod proxy_fcgi setenvif
service apache2 restart


if [ "$inst_56" -eq 1 ]; then
press_enter "=== Press enter to install PHP 5.6 ==============================================================================="
apt-get -y install php5.6-mbstring php5.6-bcmath php5.6-cli php5.6-curl php5.6-fpm php5.6-gd php5.6-intl php5.6-mcrypt php5.6-mysql php5.6-soap php5.6-xml php5.6-zip php5.6-memcache php5.6-memcached
update-rc.d php5.6-fpm defaults
a2enconf php5.6-fpm
systemctl restart apache2
cp -r /etc/php/5.6/ /root/vst_install_backups/php5.6/
# rm -f /etc/php/5.6/fpm/pool.d/*
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-56.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-56.stpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-56.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-56.tpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-56.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-56.sh
chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-56.sh
patch -p1 --directory=/ < /root/vesta-temp-dl/vesta/patch/php5-deb9.patch
press_enter "=== Press enter to continue ==============================================================================="
fi

if [ "$inst_70" -eq 1 ]; then
press_enter "=== Press enter to install PHP 7.0 ==============================================================================="
apt-get -y install php7.0-mbstring php7.0-bcmath php7.0-cli php7.0-curl php7.0-fpm php7.0-gd php7.0-intl php7.0-mcrypt php7.0-mysql php7.0-soap php7.0-xml php7.0-zip php7.0-memcache php7.0-memcached
update-rc.d php7.0-fpm defaults
a2enconf php7.0-fpm
systemctl restart apache2
cp -r /etc/php/7.0/ /root/vst_install_backups/php7.0/
# rm -f /etc/php/7.0/fpm/pool.d/*
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-70.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-70.stpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-70.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-70.tpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-70.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-70.sh
chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-70.sh
if [ $debian_version -eq 9 ]; then
  cp /etc/php/7.0/apache2/php.ini /etc/php/7.0/fpm/php.ini
fi
if [ $debian_version -eq 10 ]; then
  cp /etc/php/7.3/fpm/php.ini /etc/php/7.0/fpm/php.ini
fi
press_enter "=== Press enter to continue ==============================================================================="
fi

if [ "$inst_71" -eq 1 ]; then
press_enter "=== Press enter to install PHP 7.1 ==============================================================================="
apt-get -y install php7.1-mbstring php7.1-bcmath php7.1-cli php7.1-curl php7.1-fpm php7.1-gd php7.1-intl php7.1-mcrypt php7.1-mysql php7.1-soap php7.1-xml php7.1-zip php7.1-memcache php7.1-memcached
update-rc.d php7.1-fpm defaults
a2enconf php7.1-fpm
systemctl restart apache2
cp -r /etc/php/7.1/ /root/vst_install_backups/php7.1/
# rm -f /etc/php/7.1/fpm/pool.d/*
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-71.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-71.stpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-71.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-71.tpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-71.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-71.sh
chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-71.sh
if [ $debian_version -eq 9 ]; then
  cp /etc/php/7.0/apache2/php.ini /etc/php/7.1/fpm/php.ini
fi
if [ $debian_version -eq 10 ]; then
  cp /etc/php/7.3/fpm/php.ini /etc/php/7.1/fpm/php.ini
fi
press_enter "=== Press enter to continue ==============================================================================="
fi

if [ "$inst_72" -eq 1 ]; then
press_enter "=== Press enter to install PHP 7.2 ==============================================================================="
apt-get -y install php7.2-mbstring php7.2-bcmath php7.2-cli php7.2-curl php7.2-fpm php7.2-gd php7.2-intl php7.2-mysql php7.2-soap php7.2-xml php7.2-zip php7.2-memcache php7.2-memcached
update-rc.d php7.2-fpm defaults
a2enconf php7.2-fpm
systemctl restart apache2
cp -r /etc/php/7.2/ /root/vst_install_backups/php7.2/
# rm -f /etc/php/7.2/fpm/pool.d/*
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-72.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-72.stpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-72.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-72.tpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-72.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-72.sh
chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-72.sh
if [ $debian_version -eq 9 ]; then
  cp /etc/php/7.0/apache2/php.ini /etc/php/7.2/fpm/php.ini
fi
if [ $debian_version -eq 10 ]; then
  cp /etc/php/7.3/fpm/php.ini /etc/php/7.2/fpm/php.ini
fi
press_enter "=== Press enter to continue ==============================================================================="
fi

if [ "$inst_73" -eq 1 ]; then
press_enter "=== Press enter to install PHP 7.3 ==============================================================================="
apt-get -y install php7.3-mbstring php7.3-bcmath php7.3-cli php7.3-curl php7.3-fpm php7.3-gd php7.3-intl php7.3-mysql php7.3-soap php7.3-xml php7.3-zip php7.3-memcache php7.3-memcached
update-rc.d php7.3-fpm defaults
a2enconf php7.3-fpm
systemctl restart apache2
cp -r /etc/php/7.3/ /root/vst_install_backups/php7.3/
# rm -f /etc/php/7.3/fpm/pool.d/*
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-73.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73.stpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-73.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73.tpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-73.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73.sh
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-73-public.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73-public.stpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-73-public.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73-public.tpl
wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-73-public.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73-public.sh
chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73.sh
chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-73-public.sh
if [ $debian_version -eq 9 ]; then
  cp /etc/php/7.0/apache2/php.ini /etc/php/7.3/fpm/php.ini
fi
press_enter "=== Press enter to continue ==============================================================================="
fi

if [ "$inst_74" -eq 1 ]; then
    press_enter "=== Press enter to install PHP 7.4 ==============================================================================="
    apt-get -y install php7.4-mbstring php7.4-bcmath php7.4-cli php7.4-curl php7.4-fpm php7.4-gd php7.4-intl php7.4-mysql php7.4-soap php7.4-xml php7.4-zip php7.4-memcache php7.4-memcached
    update-rc.d php7.4-fpm defaults
    a2enconf php7.4-fpm
    systemctl restart apache2
    cp -r /etc/php/7.4/ /root/vst_install_backups/php7.4/
    wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-74.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74.stpl
    wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-74.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74.tpl
    wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-74.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74.sh
    wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-74-public.stpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74-public.stpl
    wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-74-public.tpl -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74-public.tpl
    wget -nv https://c.myvestacp.com/tools/apache-fpm-tpl/PHP-FPM-74-public.sh -O /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74-public.sh
    chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74.sh
    chmod a+x /usr/local/vesta/data/templates/web/apache2/PHP-FPM-74-public.sh
    if [ $debian_version -eq 9 ]; then
        cp /etc/php/7.0/apache2/php.ini /etc/php/7.4/fpm/php.ini
    fi
    if [ $debian_version -eq 10 ]; then
        cp /etc/php/7.3/fpm/php.ini /etc/php/7.4/fpm/php.ini
    fi
    press_enter "=== Press enter to continue ==============================================================================="
fi
