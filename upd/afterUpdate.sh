#!/bin/bash

source /etc/profile.d/vesta.sh
source /usr/local/vesta/func/main.sh
source /usr/local/vesta/conf/vesta.conf

if [ "$VERSION" = "0.9.8" ]; then
    #Convert to made I.T.
    bash /usr/local/vesta/upd/add_ipv6.sh
    bash /usr/local/vesta/upd/add_plugin.sh
    VERSION="0.0.1"
    sed -i "s/VERSION=.*/VERSION='0.0.1'/g" /usr/local/vesta/conf/vesta.conf
fi

if [ "$VERSION" = "0.0.1" ]; then
    VERSION="0.0.2"
    sed -i "s/VERSION=.*/VERSION='0.0.2'/g" /usr/local/vesta/conf/vesta.conf
fi

if [ "$VERSION" = "0.0.2" ]; then
    VERSION="0.0.3"
    sed -i "s/VERSION=.*/VERSION='0.0.3'/g" /usr/local/vesta/conf/vesta.conf
fi

if [ "$VERSION" = "0.0.3" ]; then
    bash /usr/local/vesta/upd/add_mail_ssl.sh
    VERSION="0.0.4"
    sed -i "s/VERSION=.*/VERSION='0.0.4'/g" /usr/local/vesta/conf/vesta.conf
    
    
    $BIN/v-update-web-templates
    userlist=$(ls --sort=time $VESTA/data/users/)
    for user in $userlist; do
        $BIN/v-rebuild-user $user
    done
    echo "PLUGIN='monitor-log' NAME='Log monitor' VERSION='1.0.0' BUILDNUMBER='1' LATEST_VERSION='1.0.0' LATEST_BUILDNUMBER='1' KEY='' ACTIVE='yes' TIME='22:00:00' DATE='2017-10-29'" >> $VESTA/conf/plugin.conf 
    echo "PLUGIN='monitor-log-dashboard' NAME='Log dashboard monitor' VERSION='1.0.0' BUILDNUMBER='1' LATEST_VERSION='1.0.0' LATEST_BUILDNUMBER='1' KEY='' ACTIVE='yes' TIME='22:00:00' DATE='2017-10-29'" >> $VESTA/conf/plugin.conf 
fi