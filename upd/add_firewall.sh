#!/bin/bash

source /etc/profile.d/devit.sh
if [ ! -e "$VESTA/data/firewall" ]; then
    mkdir -p $VESTA/data/firewall
    chmod 770 $VESTA/data/firewall

    cp $VESTA/install/rhel/firewall/* \
        $VESTA/data/firewall/
    chmod 660 $VESTA/data/firewall/*

    source $VESTA/conf/devit.conf
    if [ -z "$FIREWALL_SYSTEM" ]; then
        echo "FIREWALL_SYSTEM='iptables'" \
            >> $VESTA/conf/devit.conf
    fi
fi
