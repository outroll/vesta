# User account rebuild
rebuild_user_conf() {

    # Get user variables
    source $USER_DATA/user.conf

    # Creating user data files
    chmod 770 $USER_DATA
    chmod 660 $USER_DATA/user.conf
    touch $USER_DATA/backup.conf
    chmod 660 $USER_DATA/backup.conf
    touch $USER_DATA/history.log
    chmod 660 $USER_DATA/history.log
    touch $USER_DATA/stats.log
    chmod 660 $USER_DATA/stats.log

    # Run template trigger
    if [ -x "$VESTA/data/packages/$PACKAGE.sh" ]; then
        $VESTA/data/packages/$package.sh "$user" "$CONTACT" "$FNAME" "$LNAME"
    fi

    # Rebuild user
    shell=$(grep -w "$SHELL" /etc/shells |head -n1)
    /usr/sbin/useradd "$user" -s "$shell" -c "$CONTACT" \
        -m -d "$HOMEDIR/$user" > /dev/null 2>&1

    # Update user shell
    /usr/bin/chsh -s "$shell" "$user" &>/dev/null

    # Update password
    shadow=$(grep ^$user: /etc/shadow)
    shdw3=$(echo "$shadow" | cut -f3 -d :)
    shdw4=$(echo "$shadow" | cut -f4 -d :)
    shdw5=$(echo "$shadow" | cut -f5 -d :)
    shdw6=$(echo "$shadow" | cut -f6 -d :)
    shdw7=$(echo "$shadow" | cut -f7 -d :)
    shdw8=$(echo "$shadow" | cut -f8 -d :)
    shdw9=$(echo "$shadow" | cut -f9 -d :)
    shadow_str="$user:$MD5:$shdw3:$shdw4:$shdw5:$shdw6"
    shadow_str="$shadow_str:$shdw7:$shdw8:$shdw9"

    chmod u+w /etc/shadow
    sed -i "/^$user:*/d" /etc/shadow
    echo "$shadow_str" >> /etc/shadow
    chmod u-w /etc/shadow

    # Building directory tree
    if [ -e "$HOMEDIR/$user/conf" ]; then
        chattr -i $HOMEDIR/$user/conf
    fi
    mkdir -p $HOMEDIR/$user/conf
    chmod a+x $HOMEDIR/$user
    chmod a+x $HOMEDIR/$user/conf
    chown $user:$user $HOMEDIR/$user
    chown root:root $HOMEDIR/$user/conf

    # Update disk pipe
    sed -i "/ $user$/d" $VESTA/data/queue/disk.pipe
    echo "$BIN/v-update-user-disk $user" >> $VESTA/data/queue/disk.pipe

    # WEB
    if [ ! -z "$WEB_SYSTEM" ] && [ "$WEB_SYSTEM" != 'no' ]; then
        mkdir -p $USER_DATA/ssl
        chmod 770 $USER_DATA/ssl
        touch $USER_DATA/web.conf
        chmod 660 $USER_DATA/web.conf
        if [ "$(grep -w $user $VESTA/data/queue/traffic.pipe)" ]; then
            echo "$BIN/v-update-web-domains-traff $user" \
                >> $VESTA/data/queue/traffic.pipe
        fi
        echo "$BIN/v-update-web-domains-disk $user" \
            >> $VESTA/data/queue/disk.pipe

        mkdir -p $HOMEDIR/$user/conf/web
        mkdir -p $HOMEDIR/$user/web
        mkdir -p $HOMEDIR/$user/tmp
        chmod 751 $HOMEDIR/$user/conf/web
        chmod 751 $HOMEDIR/$user/web
        chmod 771 $HOMEDIR/$user/tmp
        chown $user:$user $HOMEDIR/$user/web
        if [ -z "$create_user" ]; then
            $BIN/v-rebuild-web-domains $user $restart
        fi
    fi

    # DNS
    if [ ! -z "$DNS_SYSTEM" ] && [ "$DNS_SYSTEM" != 'no' ]; then
        mkdir -p $USER_DATA/dns
        chmod 770 $USER_DATA/dns
        touch $USER_DATA/dns.conf
        chmod 660 $USER_DATA/dns.conf

        mkdir -p $HOMEDIR/$user/conf/dns
        chmod 751 $HOMEDIR/$user/conf/dns
        if [ -z "$create_user" ]; then
            $BIN/v-rebuild-dns-domains $user $restart
        fi
    fi

    if [ ! -z "$MAIL_SYSTEM" ] && [ "$MAIL_SYSTEM" != 'no' ]; then
        mkdir -p $USER_DATA/mail
        chmod 770 $USER_DATA/mail
        touch $USER_DATA/mail.conf
        chmod 660 $USER_DATA/mail.conf
        echo "$BIN/v-update-mail-domains-disk $user" \
            >> $VESTA/data/queue/disk.pipe

        mkdir -p $HOMEDIR/$user/conf/mail
        mkdir -p $HOMEDIR/$user/mail
        chmod 751 $HOMEDIR/$user/mail
        chmod 751 $HOMEDIR/$user/conf/mail
        if [ -z "$create_user" ]; then
            $BIN/v-rebuild-mail-domains $user
        fi
    fi


    if [ ! -z "$DB_SYSTEM" ] && [ "$DB_SYSTEM" != 'no' ]; then
        touch $USER_DATA/db.conf
        chmod 660 $USER_DATA/db.conf
        echo "$BIN/v-update-databases-disk $user" >> $VESTA/data/queue/disk.pipe

        if [ -z "$create_user" ]; then
            $BIN/v-rebuild-databases $user
        fi
    fi

    if [ ! -z "$CRON_SYSTEM" ] && [ "$CRON_SYSTEM" != 'no' ]; then
        touch $USER_DATA/cron.conf
        chmod 660 $USER_DATA/cron.conf

        if [ -z "$create_user" ]; then
            $BIN/v-rebuild-cron-jobs $user $restart
        fi
    fi

    # Set immutable flag
    chattr +i $HOMEDIR/$user/conf
}

# WEB domain rebuild
rebuild_web_domain_conf() {

    # Get domain values
    domain_idn=$(idn -t --quiet -a "$domain")
    get_domain_values 'web'
    ip=$(get_real_ip $IP)

    # Preparing domain values for the template substitution
    upd_web_domain_values

    # Rebuilding directories
    mkdir -p $HOMEDIR/$user/web/$domain \
        $HOMEDIR/$user/web/$domain/public_html \
        $HOMEDIR/$user/web/$domain/public_shtml \
        $HOMEDIR/$user/web/$domain/document_errors \
        $HOMEDIR/$user/web/$domain/cgi-bin \
        $HOMEDIR/$user/web/$domain/private \
        $HOMEDIR/$user/web/$domain/stats \
        $HOMEDIR/$user/web/$domain/logs

    # Create domain logs
    touch /var/log/$WEB_SYSTEM/domains/$domain.bytes \
          /var/log/$WEB_SYSTEM/domains/$domain.log \
          /var/log/$WEB_SYSTEM/domains/$domain.error.log

    # Create symlinks
    cd $HOMEDIR/$user/web/$domain/logs/
    ln -f -s /var/log/$WEB_SYSTEM/domains/$domain.log .
    ln -f -s /var/log/$WEB_SYSTEM/domains/$domain.error.log .
    cd - > /dev/null

    # Propagate html skeleton
    if [ ! -e "$WEBTPL/skel/document_errors/" ]; then
        cp -r $WEBTPL/skel/document_errors/ $HOMEDIR/$user/web/$domain/
    fi

    # Set folder permissions
    chmod 551 $HOMEDIR/$user/web/$domain
    chmod 751 $HOMEDIR/$user/web/$domain/private
    chmod 751 $HOMEDIR/$user/web/$domain/cgi-bin
    chmod 751 $HOMEDIR/$user/web/$domain/public_html
    chmod 751 $HOMEDIR/$user/web/$domain/public_shtml
    chmod 751 $HOMEDIR/$user/web/$domain/document_errors
    chmod 551 $HOMEDIR/$user/web/$domain/stats
    chmod 551 $HOMEDIR/$user/web/$domain/logs
    chmod 640 /var/log/$WEB_SYSTEM/domains/$domain.*

    # Set ownership
    chown $user:$user $HOMEDIR/$user/web/$domain
    chown $user:$user $HOMEDIR/$user/web/$domain/private
    chown $user:$user $HOMEDIR/$user/web/$domain/cgi-bin
    chown $user:$user $HOMEDIR/$user/web/$domain/public_html
    chown $user:$user $HOMEDIR/$user/web/$domain/public_shtml
    chown -R $user:$user $HOMEDIR/$user/web/$domain/document_errors
    chown root:$user /var/log/$WEB_SYSTEM/domains/$domain.*

    # Adding tmp conf
    tpl_file="$WEBTPL/$WEB_SYSTEM/$TPL.tpl"
    conf="$HOMEDIR/$user/conf/web/tmp_$WEB_SYSTEM.conf"
    add_web_config
    chown root:$user $conf
    chmod 640 $conf

    # Running template trigger
    if [ -x $WEBTPL/$WEB_SYSTEM/$TPL.sh ]; then
        $WEBTPL/$WEB_SYSTEM/$TPL.sh $user $domain $ip $HOMEDIR $docroot
    fi

    # Checking aliases
    if [ ! -z "$ALIAS" ]; then
        aliases=$(echo "$ALIAS"|tr ',' '\n'| wc -l)
        user_aliases=$((user_aliases + aliases))
    fi

    # Checking stats
    if [ ! -z "$STATS" ]; then
        cat $WEBTPL/$STATS/$STATS.tpl |\
            sed -e "s/%ip%/$ip/g" \
                -e "s/%web_port%/$WEB_PORT/g" \
                -e "s/%web_ssl_port%/$WEB_SSL_PORT/g" \
                -e "s/%proxy_port%/$PROXY_PORT/g" \
                -e "s/%proxy_ssl_port%/$PROXY_SSL_PORT/g" \
                -e "s/%domain_idn%/$domain_idn/g" \
                -e "s/%domain%/$domain/g" \
                -e "s/%user%/$user/g" \
                -e "s/%home%/${HOMEDIR////\/}/g" \
                -e "s/%alias%/${aliases//,/ }/g" \
                -e "s/%alias_idn%/${aliases_idn//,/ }/g" \
                > $HOMEDIR/$user/conf/web/$STATS.$domain.conf

        if [ "$STATS" == 'awstats' ]; then
            if [ ! -e "/etc/awstats/$STATS.$domain_idn.conf" ]; then
                ln -f -s $HOMEDIR/$user/conf/web/$STATS.$domain.conf \
                    /etc/awstats/$STATS.$domain_idn.conf
            fi
        fi

        webstats="$BIN/v-update-web-domain-stat $user $domain"
        check_webstats=$(grep "$webstats" $VESTA/data/queue/webstats.pipe)
        if [ -z "$check_webstats" ]; then
            echo "$webstats" >> $VESTA/data/queue/webstats.pipe
        fi

        if [ ! -z "$STATS_USER" ]; then
            stats_dir="$HOMEDIR/$user/web/$domain/stats"

            # Adding htaccess file
            echo "AuthUserFile $stats_dir/.htpasswd" > $stats_dir/.htaccess
            echo "AuthName \"Web Statistics\"" >> $stats_dir/.htaccess
            echo "AuthType Basic" >> $stats_dir/.htaccess
            echo "Require valid-user" >> $stats_dir/.htaccess

            # Generating htaccess user and password
            echo "$STATS_USER:$STATS_CRYPT" > $stats_dir/.htpasswd
        fi
    fi

    # Checking SSL
    if [ "$SSL" = 'yes' ]; then

        # Adding domain to the web conf
        conf="$HOMEDIR/$user/conf/web/tmp_s$WEB_SYSTEM.conf"
        tpl_file="$WEBTPL/$WEB_SYSTEM/$TPL.stpl"
        add_web_config
        chown root:$user $conf
        chmod 640 $conf

        cp -f $USER_DATA/ssl/$domain.crt \
            $HOMEDIR/$user/conf/web/ssl.$domain.crt
        cp -f $USER_DATA/ssl/$domain.key \
            $HOMEDIR/$user/conf/web/ssl.$domain.key
        cp -f $USER_DATA/ssl/$domain.pem \
            $HOMEDIR/$user/conf/web/ssl.$domain.pem
        if [ -e "$USER_DATA/ssl/$domain.ca" ]; then
            cp -f $USER_DATA/ssl/$domain.ca \
                $HOMEDIR/$user/conf/web/ssl.$domain.ca
        fi

        # Running template trigger
        if [ -x $WEBTPL/$WEB_SYSTEM/$TPL.sh ]; then
            $WEBTPL/$WEB_SYSTEM/$TPL.sh $user $domain $ip $HOMEDIR $sdocroot
        fi

        user_ssl=$((user_ssl + 1))
        ssl_change='yes'
    fi

    # Checking proxy
    if [ ! -z "$PROXY_SYSTEM" ] && [ ! -z "$PROXY" ]; then
        tpl_file="$WEBTPL/$PROXY_SYSTEM/$PROXY.tpl"
        conf="$HOMEDIR/$user/conf/web/tmp_$PROXY_SYSTEM.conf"
        add_web_config
        chown root:$user $conf
        chmod 640 $conf
        proxy_change='yes'
    fi

    if [ ! -z "$PROXY_SYSTEM" ] && [ "$SSL" = 'yes' ]; then
        tpl_file="$WEBTPL/$PROXY_SYSTEM/$PROXY.stpl"
        if [ -z "$PROXY" ]; then
            tpl_file="$WEBTPL/$PROXY_SYSTEM/default.stpl"
        fi
        conf="$HOMEDIR/$user/conf/web/tmp_s$PROXY_SYSTEM.conf"
        add_web_config
        chown root:$user $conf
        chmod 640 $conf
        proxy_change='yes'
    fi

    if [ "$SUSPENDED" = 'yes' ]; then
        suspended_web=$((suspended_web + 1))
    fi
    user_domains=$((user_domains + 1))

    # Running template trigger
    if [ -x $WEBTPL/$PROXY_SYSTEM/$PROXY.sh ]; then
        $WEBTPL/$PROXY_SYSTEM/$PROXY.sh $user $domain $ip $HOMEDIR $docroot
    fi

    # Checking ftp
    if [ ! -z "$FTP_USER" ]; then
        if [ -z "$(grep ^$FTP_USER: /etc/passwd)" ]; then
            shell='/sbin/nologin'
            if [ -e "/usr/bin/rssh" ]; then
                shell='/usr/bin/rssh'
            fi
            /usr/sbin/useradd $FTP_USER \
                -s $shell \
                -o -u $(id -u $user) \
                -g $user \
                -M -d "$HOMEDIR/$user/web/$domain"  > /dev/null 2>&1

            # Update password
            shadow=$(grep "^$FTP_USER:" /etc/shadow)
            shdw3=$(echo "$shadow" | cut -f3 -d :)
            shdw4=$(echo "$shadow" | cut -f4 -d :)
            shdw5=$(echo "$shadow" | cut -f5 -d :)
            shdw6=$(echo "$shadow" | cut -f6 -d :)
            shdw7=$(echo "$shadow" | cut -f7 -d :)
            shdw8=$(echo "$shadow" | cut -f8 -d :)
            shdw9=$(echo "$shadow" | cut -f9 -d :)
            shadow_str="$FTP_USER:$FTP_MD5:$shdw3:$shdw4:$shdw5:$shdw6"
            shadow_str="$shadow_str:$shdw7:$shdw8:$shdw9"

            chmod u+w /etc/shadow
            sed -i "/^$FTP_USER:*/d" /etc/shadow
            echo "$shadow_str" >> /etc/shadow
            chmod u-w /etc/shadow
        fi
    fi
}

# DNS domain rebuild
rebuild_dns_domain_conf() {

    # Get domain values
    get_domain_values 'dns'
    domain_idn=$(idn -t --quiet -a "$domain")

    # Checking zone file
    if [ ! -e "$USER_DATA/dns/$domain.conf" ]; then
        cat $DNSTPL/$TPL.tpl |\
            sed -e "s/%ip%/$IP/g" \
                -e "s/%domain_idn%/$domain_idn/g" \
                -e "s/%domain%/$domain/g" \
                -e "s/%ns1%/$ns1/g" \
                -e "s/%ns2%/$ns2/g" \
                -e "s/%ns3%/$ns3/g" \
                -e "s/%ns4%/$ns4/g" \
                -e "s/%time%/$TIME/g" \
                -e "s/%date%/$DATE/g" > $USER_DATA/dns/$domain.conf
    fi

    # Sorting records
    sort_dns_records

    # Updating zone
    update_domain_zone

    # Set permissions
    if [ "$DNS_SYSTEM" = 'named' ]; then
        dns_group='named'
    else
        dns_group='bind'
    fi

    # Set file permissions
    chmod 640 $HOMEDIR/$user/conf/dns/$domain.db
    chown root:$dns_group $HOMEDIR/$user/conf/dns/$domain.db

    # Get dns config path
    if [ -e '/etc/named.conf' ]; then
        dns_conf='/etc/named.conf'
    fi

    if [ -e '/etc/bind/named.conf' ]; then
        dns_conf='/etc/bind/named.conf'
    fi

    # Bind config check
    if [ "$SUSPENDED" = 'yes' ]; then
        rm_string=$(grep -n /etc/namedb/$domain.db $dns_conf | cut -d : -f 1)
        if [ ! -z "$rm_string" ]; then
            sed -i "$rm_string d" $dns_conf
        fi
        suspended_dns=$((suspended_dns + 1))
    else
        if [ -z "$(grep /$domain.db $dns_conf)" ]; then
            named="zone \"$domain_idn\" {type master; file"
            named="$named \"$HOMEDIR/$user/conf/dns/$domain.db\";};"
            echo "$named" >> $dns_conf
        fi
    fi
    user_domains=$((user_domains + 1))
    records=$(wc -l $USER_DATA/dns/$domain.conf | cut -f 1 -d ' ')
    user_records=$((user_records + records))
    update_object_value 'dns' 'DOMAIN' "$domain" '$RECORDS' "$records"
}

# MAIL domain rebuild
rebuild_mail_domain_conf() {

    # Get domain values
    domain_idn=$(idn -t --quiet -a "$domain")
    get_domain_values 'mail'

    # Rebuilding config structure
    rm -f /etc/$MAIL_SYSTEM/domains/$domain_idn
    mkdir -p $HOMEDIR/$user/conf/mail/$domain
    ln -s $HOMEDIR/$user/conf/mail/$domain \
        /etc/$MAIL_SYSTEM/domains/$domain_idn
    rm -f $HOMEDIR/$user/conf/mail/$domain/aliases
    rm -f $HOMEDIR/$user/conf/mail/$domain/antispam
    rm -f $HOMEDIR/$user/conf/mail/$domain/antivirus
    rm -f $HOMEDIR/$user/conf/mail/$domain/protection
    rm -f $HOMEDIR/$user/conf/mail/$domain/passwd
    rm -f $HOMEDIR/$user/conf/mail/$domain/fwd_only
    touch $HOMEDIR/$user/conf/mail/$domain/aliases
    touch $HOMEDIR/$user/conf/mail/$domain/passwd
    touch $HOMEDIR/$user/conf/mail/$domain/fwd_only

    # Adding antispam protection
    if [ "$ANTISPAM" = 'yes' ]; then
        touch $HOMEDIR/$user/conf/mail/$domain/antispam
    fi

    # Adding antivirus protection
    if [ "$ANTIVIRUS" = 'yes' ]; then
        touch $HOMEDIR/$user/conf/mail/$domain/antivirus
    fi

    # Adding dkim
    if [ "$DKIM" = 'yes' ]; then
        U_MAIL_DKMI=$((U_MAIL_DKMI + 1))
        pem="$USER_DATA/mail/$domain.pem"
        pub="$USER_DATA/mail/$domain.pub"
        openssl genrsa -out $pem 1024 &>/dev/null
        openssl rsa -pubout -in $pem -out $pub &>/dev/null
        cp $pem $HOMEDIR/$user/conf/mail/$domain/dkim.pem

        # Deleting old dkim records
        records=$($BIN/v-list-dns-records $user $domain plain)
        dkim_records=$(echo "$records" |grep -w '_domainkey'|cut -f 1 -d ' ')
        for id in $dkim_records; do
            $BIN/v-delete-dns-record $user $domain $id
        done

        # Adding new dkim dns records
        check_dns_domain=$(is_object_valid 'dns' 'DOMAIN' "$domain")
        if [ "$?" -eq 0 ]; then
            add_mail_domain_dkim_dns $user $domain
        fi
    fi

    # Removing symbolic link
    if [ "$SUSPENDED" = 'yes' ]; then
        SUSPENDED_MAIL=$((SUSPENDED_MAIL +1))
        rm -f /etc/exim/domains/$domain_idn
    fi

    if [ ! -e $HOMEDIR/$user/mail/$domain_idn ]; then
        mkdir $HOMEDIR/$user/mail/$domain_idn
    fi

    dom_aliases=$HOMEDIR/$user/conf/mail/$domain/aliases
    if [ ! -z "$CATCHALL" ]; then
        echo "*@$domain:$CATCHALL" >> $dom_aliases
    fi

    # Rebuild domain accounts
    accs=0
    dom_diks=0
    if [ -e "$USER_DATA/mail/$domain.conf" ]; then
        accounts=$(search_objects "mail/$domain" 'SUSPENDED' "no" 'ACCOUNT')
    else
        accounts=''
    fi
    for account in $accounts; do
        (( ++accs))
        dom_diks=$((dom_diks + U_DISK))
        object=$(grep "ACCOUNT='$account'" $USER_DATA/mail/$domain.conf)
        FWD_ONLY='no'
        eval "$object"
        if [ "$SUSPENDED" = 'yes' ]; then
            MD5='SUSPENDED'
        fi

        str="$account:$MD5:$user:mail::$HOMEDIR/$user:$QUOTA"
        echo $str >> $HOMEDIR/$user/conf/mail/$domain/passwd

        for malias in ${ALIAS//,/ }; do
            echo "$malias@$domain:$account@$domain" >> $dom_aliases
        done
        if [ ! -z "$FWD" ]; then
            echo "$account@$domain:$FWD" >> $dom_aliases
        fi
        if [ "$FWD_ONLY" = 'yes' ]; then
            echo "$account" >> $HOMEDIR/$user/conf/mail/$domain/fwd_only
        fi
    done

    # Set permissions
    chmod 660 $USER_DATA/mail/$domain.*
    chmod 771 $HOMEDIR/$user/conf/mail/$domain
    chmod 660 $HOMEDIR/$user/conf/mail/$domain/*
    chmod 771 /etc/$MAIL_SYSTEM/domains/$domain_idn
    chmod 770 $HOMEDIR/$user/mail/$domain_idn

    # Set ownership
    if [ "$MAIL_SYSTEM" = 'exim' ]; then
        mail_user=exim
    fi
    if [ "$MAIL_SYSTEM" = 'exim4' ]; then
        mail_user=Debian-exim
    fi
    chown -R $mail_user:mail $HOMEDIR/$user/conf/mail/$domain
    chown -R dovecot:mail $HOMEDIR/$user/conf/mail/$domain/passwd
    chown $user:mail $HOMEDIR/$user/mail/$domain_idn

    # Update counters
    update_object_value 'mail' 'DOMAIN' "$domain" '$ACCOUNTS' "$accs"
    update_object_value 'mail' 'DOMAIN' "$domain" '$U_DISK' "$dom_diks"
    U_MAIL_ACCOUNTS=$((U_MAIL_ACCOUNTS + accs))
    U_DISK_MAIL=$((U_DISK_MAIL + dom_diks))
    U_MAIL_DOMAINS=$((U_MAIL_DOMAINS + 1))
}

# Rebuild MySQL
rebuild_mysql_database() {

    host_str=$(grep "HOST='$HOST'" $VESTA/conf/mysql.conf)
    eval $host_str
    if [ -z $HOST ] || [ -z $USER ] || [ -z $PASSWORD ]; then
        echo "Error: mysql config parsing failed"
        if [ ! -z "$send_mail" ]; then
            echo "Can't parse MySQL DB config" | $send_mail -s "$subj" $email
        fi
        log_event "$E_PARSING" "$EVENT"
        exit $E_PARSING
    fi

    query='SELECT VERSION()'
    mysql -h $HOST -u $USER -p$PASSWORD -e "$query" > /dev/null 2>&1
    if [ '0' -ne "$?" ]; then
        echo "Error: Database connection to $HOST failed"
        if [ ! -z "$send_mail" ]; then
            echo "Database connection to MySQL host $HOST failed" |\
                $send_mail -s "$subj" $email
        fi
        log_event  "$E_CONNECT $EVENT"
        exit $E_CONNECT
    fi

    query="CREATE DATABASE \`$DB\` CHARACTER SET $CHARSET"
    mysql -h $HOST -u $USER -p$PASSWORD -e "$query" > /dev/null 2>&1

    query="GRANT ALL ON \`$DB\`.* TO \`$DBUSER\`@\`%\`"
    mysql -h $HOST -u $USER -p$PASSWORD -e "$query" > /dev/null 2>&1

    query="GRANT ALL ON \`$DB\`.* TO \`$DBUSER\`@localhost"
    mysql -h $HOST -u $USER -p$PASSWORD -e "$query" > /dev/null 2>&1

    query="UPDATE mysql.user SET Password='$MD5' WHERE User='$DBUSER';"
    mysql -h $HOST -u $USER -p$PASSWORD -e "$query" > /dev/null 2>&1

    query="FLUSH PRIVILEGES;"
    mysql -h $HOST -u $USER -p$PASSWORD -e "$query" > /dev/null 2>&1
}

# Rebuild PostgreSQL
rebuild_pgsql_database() {

    host_str=$(grep "HOST='$HOST'" $VESTA/conf/pgsql.conf)
    eval $host_str
    export PGPASSWORD="$PASSWORD"
    if [ -z $HOST ] || [ -z $USER ] || [ -z $PASSWORD ] || [ -z $TPL ]; then
        echo "Error: postgresql config parsing failed"
        if [ ! -z "$send_mail" ]; then
            echo "Can't parse PostgreSQL config" | $send_mail -s "$subj" $email
        fi
        log_event "$E_PARSING" "$EVENT"
        exit $E_PARSING
    fi

    query='SELECT VERSION()'
    psql -h $HOST -U $USER -c "$query" > /dev/null 2>&1
    if [ '0' -ne "$?" ];  then
        echo "Error: Connection failed"
        if [ ! -z "$send_mail" ]; then
            echo "Database connection to PostgreSQL host $HOST failed" |\
                $send_mail -s "$subj" $email
        fi
        log_event "$E_CONNECT" "$EVENT"
        exit $E_CONNECT
    fi

    query="CREATE ROLE $DBUSER"
    psql -h $HOST -U $USER -c "$query" > /dev/null 2>&1

    query="UPDATE pg_authid SET rolpassword='$MD5' WHERE rolname='$DBUSER'"
    psql -h $HOST -U $USER -c "$query" > /dev/null 2>&1

    query="CREATE DATABASE $DB OWNER $DBUSER"
    if [ "$TPL" = 'template0' ]; then
        query="$query ENCODING '$CHARSET' TEMPLATE $TPL"
    else
        query="$query TEMPLATE $TPL"
    fi
    psql -h $HOST -U $USER -c "$query" > /dev/null 2>&1

    query="GRANT ALL PRIVILEGES ON DATABASE $DB TO $DBUSER"
    psql -h $HOST -U $USER -c "$query" > /dev/null 2>&1

    query="GRANT CONNECT ON DATABASE template1 to $dbuser"
    psql -h $HOST -U $USER -c "$query" > /dev/null 2>&1
}


# Import MySQL dump
import_mysql_database() {

    host_str=$(grep "HOST='$HOST'" $VESTA/conf/mysql.conf)
    eval $host_str
    if [ -z $HOST ] || [ -z $USER ] || [ -z $PASSWORD ]; then
        echo "Error: mysql config parsing failed"
        log_event "$E_PARSING" "$EVENT"
        exit $E_PARSING
    fi

    mysql -h $HOST -u $USER -p$PASSWORD $DB < $1 > /dev/null 2>&1
}


# Import PostgreSQL dump
import_pgsql_database() {

    host_str=$(grep "HOST='$HOST'" $VESTA/conf/pgsql.conf)
    eval $host_str
    export PGPASSWORD="$PASSWORD"
    if [ -z $HOST ] || [ -z $USER ] || [ -z $PASSWORD ] || [ -z $TPL ]; then
        echo "Error: postgresql config parsing failed"
        log_event "$E_PARSING" "$EVENT"
        exit $E_PARSING
    fi

    psql -h $HOST -U $USER $DB < $1 > /dev/null 2>&1
}
