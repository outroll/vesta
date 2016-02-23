#!/bin/bash

source /etc/profile.d/vesta.sh
source $VESTA/func/main.sh
source $VESTA/conf/vesta.conf
VERSION=""
ipv6use=""
if [ -z "$IPV4" ]; then
    echo "IPV4='yes'" >> $VESTA/conf/vesta.conf
    ip_list=$(ls --sort=time $VESTA/data/ips/)
    for IP in $ip_list; do
        ip_data=$(cat $VESTA/data/ips/$IP)
        eval $ip_data
        if [ -z "$VERSION" ]; then
            echo "VERSION='4'" >> $VESTA/data/ips/$IP
        fi
    done
fi
if [ -z "$IPV6" ]; then
    ip=$(ip addr show dev eth0 | sed -e's/^.*inet6 \([^ ]*\)\/.*$/\1/;t;d' | head -n 1)
    if [ ! -z "$ip" ]; then
        netmask="ip addr show dev eth0 | grep '$ip' | awk -F '/' '{print \$2}' | awk '{print \$1}'"
        netmask=$(eval $netmask)
        echo "IPV6='yes'" >> $VESTA/conf/vesta.conf
        $VESTA/bin/v-add-sys-ipv6 $ip $netmask
        ipv6use=$ip
    else
        echo "IPV6='no'" >> $VESTA/conf/vesta.conf
    fi
fi

tpldir="ipv4"
source $VESTA/conf/vesta.conf
if [ "$IPV4" == 'yes' ] && [ "$IPV6" == 'no' ]; then
    tpldir="ipv4"
elif [ "$IPV4" == 'no' ] && [ "$IPV6" == 'yes' ]; then
    tpldir="ipv6"
else
    tpldir="ipv4ipv6"
fi
userlist=$(ls --sort=time $VESTA/data/users/)
for user in $userlist; do
    USER_DATA="$VESTA/data/users/$user"
    #UPDATE USER
    web_template=$(get_user_value '$WEB_TEMPLATE')
    proxy_template=$(get_user_value '$PROXY_TEMPLATE')
    dns_template=$(get_user_value '$DNS_TEMPLATE')

    if [[ $web_template == *"/"* ]]; then
      web_template=$(echo $web_template | awk -F '/' '{print $2}')
    fi
    if [[ $proxy_template == *"/"* ]]; then
      proxy_template=$(echo $proxy_template | awk -F '/' '{print $2}')
    fi
    if [[ $dns_template == *"/"* ]]; then
      dns_template=$(echo $dns_template | awk -F '/' '{print $2}')
    fi

    # Changing ns values
    update_user_value "$user" '$WEB_TEMPLATE' "$tpldir/$web_template"
    update_user_value "$user" '$PROXY_TEMPLATE' "$tpldir/$proxy_template"
    update_user_value "$user" '$DNS_TEMPLATE' "$tpldir/$dns_template"


    #UPDATE WEB
    conf="$USER_DATA/web.conf"
    while read line ; do
        eval $line
        tpl=$TPL
        backend=$BACKEND
        proxy=$PROXY
        if [[ $tpl == *"/"* ]]; then
            tpl=$(echo $TPL | awk -F '/' '{print $2}')
        fi
        if [[ $BACKEND == *"/"* ]]; then
            backend=$(echo $BACKEND | awk -F '/' '{print $2}')
        fi
        if [[ $PROXY == *"/"* ]]; then
            proxy=$(echo $PROXY | awk -F '/' '{print $2}')
        fi
        update_object_value 'web' 'DOMAIN' "$DOMAIN" '$TPL' "$tpldir/$tpl"
        update_object_value 'web' 'DOMAIN' "$DOMAIN" '$BACKEND' "$tpldir/$backend"
        update_object_value 'web' 'DOMAIN' "$DOMAIN" '$PROXY' "$tpldir/$proxy"
        update_object_value 'web' 'DOMAIN' "$DOMAIN" '$IP6' "$ipv6use"
    done < $conf

    #UPDATE DNS
    conf="$USER_DATA/dns.conf"
    while read line ; do
        eval $line
        tpl=$TPL
        if [[ $TPL == *"/"* ]]; then
            tpl=$(echo $TPL | awk -F '/' '{print $2}')
        fi
        
        update_object_value 'dns' 'DOMAIN' "$DOMAIN" '$TPL' "$tpldir/$tpl"
        if [ "$(echo $line | grep 'IP6=')" == "" ]; then
	          sed -i "s/DOMAIN='$DOMAIN' IP='$IP'/DOMAIN='$DOMAIN' IP='$IP' IP6='$ipv6use'/g" "$conf"
        else
            update_object_value 'web' 'DOMAIN' "$DOMAIN" '$IP6' "$ipv6use"
        fi
				$BIN/v-change-dns-domain-tpl $user $DOMAIN $tpl
    done < $conf
    $BIN/v-rebuild-user $user
done


/usr/local/vesta/bin/v-add-user-notification admin "IPV6 support" "Since now your vesta installation supports IPV6! You can enable this option in the <a href='/edit/server/'>server configuration</a>. Do not forget to add your IPV6 in the <a href='/list/ip/'>IP section</a>. "