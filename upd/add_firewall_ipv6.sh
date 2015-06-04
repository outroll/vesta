#!/bin/bash

source /etc/profile.d/vesta.sh
if [ ! -e "$VESTA/data/firewallv6" ]; then
    mkdir -p $VESTA/data/firewallv6
    chmod 770 $VESTA/data/firewallv6

    cp $VESTA/install/rhel/6/firewallv6/* \
        $VESTA/data/firewallv6/
    chmod 660 $VESTA/data/firewallv6/*

fi
