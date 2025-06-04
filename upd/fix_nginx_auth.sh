#!/bin/bash

source /etc/profile.d/devit.sh
source /usr/local/devit/conf/devit.conf

sed -i "s|web/%domain%/stats/auth.*|conf/web/%domain%.auth;|" \
    $devit/data/templates/web/nginx/*/*tpl >/dev/null 2>&1

if [ "$WEB_SYSTEM" != 'nginx' ]; then
    exit
fi

check=`egrep "STATS_USER='([0-9]|[a-Z].*)'" $devit/data/users/*/web.conf`
if [ ! -z "$check" ]; then
    for user in $(echo $check |cut -f1 -d: |cut -f7 -d/); do
        $devit/bin/v-rebuild-web-domains $user no >/dev/null 2>&1
    done
    $devit/bin/v-restart-service nginx
fi
