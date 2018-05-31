#!/bin/bash

source /etc/profile.d/vesta.sh
if [ -f "$VESTA/data/firewall/rules.conf" ]; then
    sed  "s/PORT/SPORT='0' DPORT/" -f $VESTA/data/firewall/rules.conf
fi
