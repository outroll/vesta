#!/bin/bash

check_grep=$(ps -A | grep -c "apt")
if [ "$check_grep" -eq 0 ]; then
    echo "apt is not running"
    echo "cleaning restart.pipe"
    sed -i "/keep_mpm_event/d" /usr/local/vesta/data/queue/restart.pipe
    /usr/local/vesta/bin/v-delete-cron-restart-job
    if [ ! -f "/usr/local/vesta/data/upgrades/keeping-mpm-event-checked" ]; then
        touch /usr/local/vesta/data/upgrades/keeping-mpm-event-checked
        echo "mpm_event is not checked"
        check_grep=$(grep -c "WEB_SYSTEM='apache2'" /usr/local/vesta/conf/vesta.conf)
        if [ "$check_grep" -eq 1 ]; then
            echo "we have apache"
            switch_to_mpm_event=0
            release=$(cat /etc/debian_version | tr "." "\n" | head -n1)
            if [ "$release" -eq 10 ]; then
                echo "ok, it's deb10"
                switch_to_mpm_event=1
            else
                check_grep=$(/usr/local/vesta/bin/v-list-sys-web-status | grep -c "Server MPM: event")
                if [ "$check_grep" -eq 1 ]; then
                    echo "ok, it's already mpm_event"
                    switch_to_mpm_event=1
                fi
            fi
            if [ "$switch_to_mpm_event" -eq 1 ]; then
                echo "ok, let's do it"
                apt-get -y remove libapache2-mod-php7.4
                a2dismod ruid2
                a2dismod suexec
                a2dismod php5.6
                a2dismod php7.0
                a2dismod php7.1
                a2dismod php7.2
                a2dismod php7.3
                a2dismod php7.4
                a2dismod mpm_prefork
                a2enmod mpm_event
                service apache2 restart
            fi
        fi
    fi
fi
