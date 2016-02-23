# Validationg ip address
is_ipv6_valid() {
    userip=${1-$ipv6}
    check_nat=$(grep -H "^NAT='$userip'" $VESTA/data/ips/* 2>/dev/null)
    if [ ! -e "$VESTA/data/ips/$userip" ] && [ -z "$check_nat" ] ; then
        echo "Error: IP $userip not exist"
        log_event "$E_NOTEXIST" "$EVENT"
        exit $E_NOTEXIST
    fi
}

# Check if ip availabile for user
is_ipv6_avalable() {
    userip=${1-$ipv6}
    if [ -e "$VESTA/data/ips/$userip" ]; then
        ip_data=$(cat $VESTA/data/ips/$userip)
    else
        nated_ip=$(grep -H "^NAT='$userip'" $VESTA/data/ips/* 2>/dev/null)
        nated_ip=$(echo "$nated_ip" | cut -f 1 -d : | cut -f 7 -d /)
        ip_data=$(cat $VESTA/data/ips/$nated_ip)
    fi
    owner=$(echo "$ip_data"|grep OWNER= | cut -f 2 -d \')
    status=$(echo "$ip_data"|grep STATUS= | cut -f 2 -d \')
    shared=no
    if [ 'admin' = "$owner" ] && [ "$status" = 'shared' ]; then
        shared='yes'
    fi
    if [ "$owner" != "$user" ] && [ "$shared" != 'yes' ]; then
        echo "Error: User $user don't have permission to use $userip"
        log_event "$E_FORBIDEN" "$EVENT"
        exit $E_FORBIDEN
    fi
}

# Check ip ownership
is_ipv6_owner() {
    # Parsing ip
    owner=$(grep 'OWNER=' $VESTA/data/ips/$ipv6|cut -f 2 -d \')
    if [ "$owner" != "$user" ]; then
        echo "Error: IPV6 $ipv6 not owned"
        log_event "$E_FORBIDEN" "$EVENT"
        exit $E_FORBIDEN
    fi
}

# Check if ip address is free
is_ipv6_free() {
    if [ -e "$VESTA/data/ips/$ipv6" ]; then
        echo "Error: IPV6 exist"
        log_event "$E_EXISTS" "$EVENT"
        exit  $E_EXISTS
    fi
}

# Get full interface name
get_ipv6_iface() {
    i=$(/sbin/ip addr | grep -w $interface |\
         awk '{print $NF}' | tail -n 1 | cut -f 2 -d :)
    if [ "$i" = "$interface" ]; then
        n=0
    else
        n=$((i + 1))
    fi
    echo "$interface:$n"
}


# Check ip address speciefic value
is_ipv6_key_empty() {
    key="$1"
    string=$(cat $VESTA/data/ips/$ipv6)
    eval $string
    eval value="$key"
    if [ ! -z "$value" ] && [ "$value" != '0' ]; then
        echo "Error: $key is not empty = $value"
        log_event "$E_EXISTS" "$EVENT"
        exit $E_EXISTS
    fi
}

# Update ip address value
update_ipv6_value() {
    key="$1"
    value="$2"
    conf="$VESTA/data/ips/$ipv6"
    str=$(cat $conf)
    eval $str
    c_key=$(echo "${key//$/}")
    eval old="${key}"
    old=$(echo "$old" | sed -e 's/\\/\\\\/g' -e 's/&/\\&/g' -e 's/\//\\\//g')
    new=$(echo "$value" | sed -e 's/\\/\\\\/g' -e 's/&/\\&/g' -e 's/\//\\\//g')
    sed -i "$str_number s/$c_key='${old//\*/\\*}'/$c_key='${new//\*/\\*}'/g"\
        $conf
}

# Get ip name
get_ipv6_name() {
    grep "NAME=" $VESTA/data/ips/$ipv6 | cut -f 2 -d \'
}

# Increase ip value
increase_ipv6_value() {
    sip=${1-ipv6}
    USER=$user
    web_key='U_WEB_DOMAINS'
    usr_key='U_SYS_USERS'
    current_web=$(grep "$web_key=" $VESTA/data/ips/$sip |cut -f 2 -d \')
    current_usr=$(grep "$usr_key=" $VESTA/data/ips/$sip |cut -f 2 -d \')
    if [ -z "$current_web" ]; then
        echo "Error: Parsing error"
        log_event "$E_PARSING" "$EVENT"
        exit $E_PARSING
    fi
    new_web=$((current_web + 1))
    if [ -z "$current_usr" ]; then
        new_usr="$USER"
    else
        check_usr=$(echo -e "${current_usr//,/\n}" |grep -w $USER)
        if [ -z "$check_usr" ]; then
            new_usr="$current_usr,$USER"
        else
            new_usr="$current_usr"
        fi
    fi

    sed -i "s/$web_key='$current_web'/$web_key='$new_web'/g" \
        $VESTA/data/ips/$sip
    sed -i "s/$usr_key='$current_usr'/$usr_key='$new_usr'/g" \
        $VESTA/data/ips/$sip
}

# Decrease ip value
decrease_ipv6_value() {
    sip=${1-ipv6}
    USER=$user
    web_key='U_WEB_DOMAINS'
    usr_key='U_SYS_USERS'

    current_web=$(grep "$web_key=" $VESTA/data/ips/$sip |cut -f 2 -d \')
    current_usr=$(grep "$usr_key=" $VESTA/data/ips/$sip |cut -f 2 -d \')

    if [ -z "$current_web" ]; then
        echo "Error: Parsing error"
        log_event "$E_PARSING" "$EVENT"
        exit $E_PARSING
    fi

    new_web=$((current_web - 1))
    check_ip=$(grep $sip $USER_DATA/web.conf |wc -l)
    if [ "$check_ip" -lt 2 ]; then
        new_usr=$(echo "$current_usr" |\
            sed "s/,/\n/g"|\
            sed "s/^$user$//g"|\
            sed "/^$/d"|\
            sed ':a;N;$!ba;s/\n/,/g')
    else
        new_usr="$current_usr"
    fi

    sed -i "s/$web_key='$current_web'/$web_key='$new_web'/g" \
        $VESTA/data/ips/$sip
    sed -i "s/$usr_key='$current_usr'/$usr_key='$new_usr'/g" \
        $VESTA/data/ips/$sip
}

# Get ip address value
get_ipv6_value() {
    key="$1"
    string=$( cat $VESTA/data/ips/$ipv6 )
    eval $string
    eval value="$key"
    echo "$value"
}

# Get real ip address
get_real_ipv6() {
    if [ -e "$VESTA/data/ips/$1" ]; then
        echo $1
    else
        nated_ip=$(grep -Hl "^NAT='$1'" $VESTA/data/ips/*)
        echo "$nated_ip" | cut -f 7 -d /
    fi
}

# Get user ip
get_user_ipv6(){
    ip=$(grep -lZ "OWNER='$1'" $VESTA/data/ips/* 2>/dev/null | xargs -0 grep -l "VERSION='6'" 2>/dev/null | head -n1)
    ip=$(echo "$ip" | cut -f 7 -d /)

    if [ -z "$ip" ]; then
        admin_ips=$(grep -lZ "OWNER='admin'" $VESTA/data/ips/* 2>/dev/null | xargs -0 grep -l "VERSION='6'" 2>/dev/null | head -n1)
        admin_ips=$(echo "$admin_ips" | cut -f 7 -d /)
        for admin_ip in $admin_ips; do
            if [ -z "$ip" ]; then
                shared=$(grep "STATUS='shared'" $VESTA/data/ips/$admin_ip)
                if [ ! -z "$shared" ]; then
                    ip=$admin_ip
                fi
            fi
        done
    fi
    echo "$ip"
}

