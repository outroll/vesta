#!/bin/bash

source /etc/profile.d/devit.sh
if [ ! -e "$devit/data/firewall" ]; then
    mkdir -p $devit/data/firewall
    chmod 770 $devit/data/firewall

    cp $devit/install/rhel/firewall/* \
        $devit/data/firewall/
    chmod 660 $devit/data/firewall/*

    source $devit/conf/devit.conf
    if [ -z "$FIREWALL_SYSTEM" ]; then
        echo "FIREWALL_SYSTEM='iptables'" \
            >> $devit/conf/devit.conf
    fi
fi
