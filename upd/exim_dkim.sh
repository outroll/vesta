#/bin/bash

# Define exim config
if [ -e "/etc/exim/exim.conf" ]; then
    # RHEL or CentOS
    conf="/etc/exim/exim.conf"
else
    # Debian or Ubuntu
    conf="/etc/exim4/exim4.conf.template"
fi

# Check existance
if [ ! -e "$conf" ]; then
    exit
fi

# Add default dkim selector
if [ ! -e /usr/local/vesta/data/dkim_selectors ]; then
    echo '*:mail' > /usr/local/vesta/data/dkim_selectors
fi

dkim1='DKIM_SELECTOR = ${lookup{${lc:${domain:$h_from:}}}lsearch*{/usr/local/vesta/data/dkim_selectors}{$value}{mail}}'
dkim2='dkim_selector = DKIM_SELECTOR'

# Configure exim
if [ $(grep -c "^DKIM_SELECTOR = " $conf) == 0 ]; then
    sed -i "/^DKIM_DOMAIN = /a $dkim1" $conf
    sed -i "s/dkim_selector = mail/$dkim2/" $conf
fi

# Restart mail server
/usr/local/vesta/bin/v-restart-mail

exit
