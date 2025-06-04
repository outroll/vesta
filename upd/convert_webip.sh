#!/bin/bash

# Include devit.conf
source /usr/local/devit/conf/devit.conf

# Check if old scheme is in use
check_oldip=$(grep "^Listen" /etc/$WEB_SYSTEM/conf.d/devit.conf)
if [ -z "$check_oldip" ]; then
    exit
fi

# Remove old ip definitions from devit.conf
sed -i "/^Listen/d" /etc/$WEB_SYSTEM/conf.d/devit.conf
sed -i "/^NameVirtualHost/d" /etc/$WEB_SYSTEM/conf.d/devit.conf
sed -i "/^$/d" /etc/$WEB_SYSTEM/conf.d/devit.conf

# Create new ip configs
for ip in $(ls /usr/local/devit/data/ips); do
    web_conf="/etc/$WEB_SYSTEM/conf.d/$ip.conf"

    if [ "$WEB_SYSTEM" = 'httpd' ] || [ "$WEB_SYSTEM" = 'apache2' ]; then
        echo "NameVirtualHost $ip:$WEB_PORT" >  $web_conf
        echo "Listen $ip:$WEB_PORT" >> $web_conf
    fi

    if [ "$WEB_SSL" = 'mod_ssl' ]; then
        echo "NameVirtualHost $ip:$WEB_SSL_PORT" >> $web_conf
        echo "Listen $ip:$WEB_SSL_PORT" >> $web_conf
    fi
done

# Restart web server
/usr/local/devit/bin/v-restart-web

exit
