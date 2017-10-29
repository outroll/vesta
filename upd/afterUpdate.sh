#!/bin/bash

source /etc/profile.d/vesta.sh
source /usr/local/vesta/func/main.sh
source /usr/local/vesta/conf/vesta.conf

if [ "$VERSION" = "0.9.8" ]; then
    #Convert to made I.T.
    bash /usr/local/vesta/upd/add_ipv6.sh
    VERSION="0.0.1"
    sed -i "s/VERSION=.*/VERSION='0.0.1'/g" /usr/local/vesta/conf/vesta.conf
fi

if [ "$VERSION" = "0.0.1" ]; then
    bash /usr/local/vesta/upd/add_mail_ssl.sh
    VERSION="0.0.2"
    sed -i "s/VERSION=.*/VERSION='0.0.2'/g" /usr/local/vesta/conf/vesta.conf
fi

