#!/bin/bash

source /etc/profile.d/vesta.sh

export PATH=$PATH:/usr/local/vesta/bin

V_BIN="$VESTA/bin"
V_TEST="$VESTA/test"
OUTPUT=0

commands='v-list-cron-jobs admin json
v-list-databases admin json
v-list-database admin admin_default json
v-list-database-host mysql localhost json
v-list-database-hosts json
v-list-dns-domains admin json
v-list-mail-domains admin json
v-list-dns-templates json
v-list-mail-domains admin json
v-list-sys-config json
v-list-sys-interfaces json
v-list-sys-ips json
v-list-sys-rrd json
v-list-user admin json
v-list-user-backups admin json
v-list-user-ips admin json
v-list-user-ns admin json
v-list-user-packages json
v-list-users json
v-list-web-domains admin json
v-list-web-domain admin example.com json
v-list-web-templates json
v-list-web-templates-proxy json'

IFS=$'\n'
for cmd in $commands; do
    script=$(echo $cmd |cut -f 1 -d ' ')
    arg1=$(echo $cmd |cut -f 2 -d ' ')
    arg2=$(echo $cmd |cut -f 3 -d ' ')
    arg3=$(echo $cmd |cut -f 4 -d ' ')
    $V_BIN/$script $arg1 $arg2 $arg3 | $V_TEST/json.sh >/dev/null 2>/dev/null
    retval="$?"
    echo -en  "$cmd"
    #echo -en '\033[60G'
    echo -n '['

    if [ "$retval" -ne 0 ]; then
        echo -n 'FAILED'
        echo -n ']'
        echo -ne '\r\n'
        $V_BIN/$script $arg1 $arg2 $arg3 | $V_TEST/json.sh
    else
        echo -n '  OK  '
        echo -n ']'
    fi
    echo -ne '\r\n'
    
    
    if [ "$retval" -ne 0 ]; then
        OUTPUT=1
    fi

done

exit $OUTPUT
