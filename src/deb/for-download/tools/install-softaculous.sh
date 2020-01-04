#!/bin/bash

if [ -f "/usr/local/vesta/web/inc/login_url.php" ]; then
    mv /usr/local/vesta/web/inc/login_url.php /usr/local/vesta/web/inc/login_url.php-bak
fi

source /etc/profile
PATH=$PATH:/usr/local/vesta/bin && export PATH

sed -i '/SOFTACULOUS/d' /usr/local/vesta/conf/vesta.conf

rm -rf /var/softaculous/
rm -rf /usr/local/vesta/softaculous/
rm -rf /usr/local/vesta/web/softaculous/

apt update

apt install --reinstall vesta-php

apt install --reinstall vesta-ioncube vesta-softaculous

service vesta stop
service vesta start

/usr/local/vesta/bin/v-add-vesta-softaculous

if [ -f "/usr/local/vesta/web/inc/login_url.php-bak" ]; then
    mv /usr/local/vesta/web/inc/login_url.php-bak /usr/local/vesta/web/inc/login_url.php
fi
