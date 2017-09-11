#!/bin/bash
source /etc/profile.d/vesta.sh
source /usr/local/vesta/func/main.sh

#Download firewallv6 templates
if [ ! -e "$VESTA/data/firewallv6" ]; then
    mkdir -p $VESTA/data/firewallv6
    chmod 770 $VESTA/data/firewallv6

    cp $VESTA/install/rhel/6/firewallv6/* \
        $VESTA/data/firewallv6/
    chmod 660 $VESTA/data/firewallv6/*

fi

#set IPv4 version
iplist=$(ls --sort=time $VESTA/data/ips/)
for ip in $iplist; do
	echo "VERSION='4'" >> $VESTA/data/ips/$ip
done

#Add IP6 field
ipv6=$(ip addr show | sed -e's/^.*inet6 \([^ ]*\)\/.*$/\1/;t;d' | grep -ve "^fe80" | tail -1)
ipv6use=""
if [ ! -z "$ipv6" ] && [ "::1" != "$ipv6" ]; then
    netmask="ip addr show | grep '$ipv6' | awk -F '/' '{print \$2}' | awk '{print \$1}'"
    netmask=$(eval $netmask)
    $VESTA/bin/v-add-sys-ipv6 $ipv6 $netmask
    $BIN/v-update-firewall-ipv6
    ipv6use=$ipv6
fi

#set IPv6
userlist=$(ls --sort=time $VESTA/data/users/)
for user in $userlist; do
    USER_DATA="$VESTA/data/users/$user"

    #UPDATE WEB
    conf="$USER_DATA/web.conf"
    while read line ; do
        eval $line
        update_object_value 'web' 'DOMAIN' "$DOMAIN" '$IP6' "$ipv6use"
    done < $conf

    #UPDATE DNS
    conf="$USER_DATA/dns.conf"
    while read line ; do
        eval $line
        if [ "$(echo $line | grep 'IP6=')" == "" ]; then
	          sed -i "s/DOMAIN='$DOMAIN' IP='$IP'/DOMAIN='$DOMAIN' IP='$IP' IP6='$ipv6use'/g" "$conf"
        else
            update_object_value 'dns' 'DOMAIN' "$DOMAIN" '$IP6' "$ipv6use"
        fi
    done < $conf
    $BIN/v-rebuild-user $user
done


#download new templates
$BIN/v-update-web-templates
$BIN/v-update-dns-templates

/usr/local/vesta/bin/v-add-user-notification admin "IPv6 support" "Your vesta installation supports IPv6!"
