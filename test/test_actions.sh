#!/bin/bash

# Define some variables
source /etc/profile.d/vesta.sh
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

export PATH=$PATH:/usr/local/vesta/bin

=======
echo $VESTA
echo $PATH
<<<<<<< HEAD
>>>>>>> a4a1122... Dockerfile
=======
PATH=$PATH:/usr/local/vesta/bin
export PATH
echo $VESTA
echo $PATH
>>>>>>> 7c18883... Dockerfile
=======
export PATH=$PATH:/usr/local/vesta/bin
<<<<<<< HEAD
>>>>>>> fe82c22... Dockerfile
=======
echo $PATH
>>>>>>> 0501919... Dockerfile
=======

export PATH=$PATH:/usr/local/vesta/bin

>>>>>>> 23c8197... Fix tests + docker permissioné
V_BIN="$VESTA/bin"
V_TEST="$VESTA/test"

# Define functions
random() {
    MATRIX='0123456789'
    LENGTH=$1
    while [ ${n:=1} -le $LENGTH ]; do
        rand="$rand${MATRIX:$(($RANDOM%${#MATRIX})):1}"
        let n+=1
    done
    echo "$rand"
}

echo_result() {
    echo -e  "$1"
    echo -en '\033[60G'
    echo -n '['

    if [ "$2" -ne 0 ]; then
        echo -n 'FAILED'
        echo -n ']'
        echo -ne '\r\n'
        echo ">>> $4"
        echo ">>> RETURN VALUE $2"
        cat $3
    else
        echo -n '  OK  '
        echo -n ']'
    fi
    echo -ne '\r\n'
}

# Create random username
user="testu_$(random 4)"
while [ ! -z "$(grep "^$user:" /etc/passwd)" ]; do
    user="tmp_$(random 4)"
done

# Create random tmpfile
tmpfile=$(mktemp -p /tmp )


#----------------------------------------------------------#
#                         User                             #
#----------------------------------------------------------#
# Add user
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-user $user $user $user@vestacp.com default Super Test"
$cmd > $tmpfile 2>&1
<<<<<<< HEAD
echo_result "USER: Adding new user $user" "$?" "$tmpfile" "$cmd"

# Change user password
cmd="v-change-user-password $user t3st_p4ssw0rd"
$cmd > $tmpfile 2>&1
echo_result "USER: Changing password" "$?" "$tmpfile" "$cmd"

# Change user contact
cmd="v-change-user-contact $user tester@vestacp.com"
$cmd > $tmpfile 2>&1
echo_result "USER: Changing email" "$?" "$tmpfile" "$cmd"

# Change system shell
cmd="v-change-user-shell $user bash"
$cmd > $tmpfile 2>&1
echo_result "USER: Changing system shell to /bin/bash" "$?" "$tmpfile" "$cmd"

# Change name servers
cmd="v-change-user-ns $user ns0.com ns1.com ns2.com ns3.com"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_user $user $user $user@vestacp.com default Super Test"
=======
cmd="v-add-user $user $user $user@vestacp.com default Super Test"
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
>>>>>>> a58f385... Fix tests
echo_result "USER: Adding new user $user" "$?" "$tmpfile" "$cmd"

# Change user password
cmd="v-change-user-password $user t3st_p4ssw0rd"
$cmd > $tmpfile 2>&1
echo_result "USER: Changing password" "$?" "$tmpfile" "$cmd"

# Change user contact
cmd="v-change-user-contact $user tester@vestacp.com"
$cmd > $tmpfile 2>&1
echo_result "USER: Changing email" "$?" "$tmpfile" "$cmd"

# Change system shell
cmd="v-change-user-shell $user bash"
$cmd > $tmpfile 2>&1
echo_result "USER: Changing system shell to /bin/bash" "$?" "$tmpfile" "$cmd"

# Change name servers
cmd="v-change-user-ns $user ns0.com ns1.com ns2.com ns3.com"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "USER: Changing nameservers" "$?" "$tmpfile" "$cmd"


#----------------------------------------------------------#
#                         Cron                             #
#----------------------------------------------------------#

# Add cron job
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-cron-job $user 1 1 1 1 1 echo"
$cmd > $tmpfile 2>&1
echo_result "CRON: Adding cron job" "$?" "$tmpfile" "$cmd"

# Suspend cron job
cmd="v-suspend-cron-job $user 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Suspending cron job" "$?" "$tmpfile" "$cmd"

# Unsuspend cron job
cmd="v-unsuspend-cron-job $user 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Unsuspending cron job" "$?" "$tmpfile" "$cmd"

# Delete cron job
cmd="v-delete-cron-job $user 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Deleting cron job" "$?" "$tmpfile" "$cmd"

# Add cron job
cmd="v-add-cron-job $user 1 1 1 1 1 echo 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Adding cron job" "$?" "$tmpfile" "$cmd"

# Add cron job
cmd="v-add-cron-job $user 1 1 1 1 1 echo 1"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_cron_job $user 1 1 1 1 1 echo"
=======
cmd="v-add-cron-job $user 1 1 1 1 1 echo"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "CRON: Adding cron job" "$?" "$tmpfile" "$cmd"

# Suspend cron job
cmd="v-suspend-cron-job $user 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Suspending cron job" "$?" "$tmpfile" "$cmd"

# Unsuspend cron job
cmd="v-unsuspend-cron-job $user 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Unsuspending cron job" "$?" "$tmpfile" "$cmd"

# Delete cron job
cmd="v-delete-cron-job $user 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Deleting cron job" "$?" "$tmpfile" "$cmd"

# Add cron job
cmd="v-add-cron-job $user 1 1 1 1 1 echo 1"
$cmd > $tmpfile 2>&1
echo_result "CRON: Adding cron job" "$?" "$tmpfile" "$cmd"

# Add cron job
cmd="v-add-cron-job $user 1 1 1 1 1 echo 1"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
if [ "$?" -eq 4 ]; then
    retval=0
else
    retval=1
fi
echo_result "CRON: Duplicate cron job check" "$retval" "$tmpfile" "$cmd"

# Add second cron job
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-cron-job $user 2 2 2 2 2 echo 2"
$cmd > $tmpfile 2>&1
<<<<<<< HEAD
echo_result "CRON: Adding second cron job" "$?" "$tmpfile" "$cmd"

# Rebuild cron jobs
cmd="v-rebuild-cron-jobs $user"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_cron_job $user 2 2 2 2 2 echo 2"
=======
cmd="v-add-cron-job $user 2 2 2 2 2 echo 2"
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
>>>>>>> a58f385... Fix tests
echo_result "CRON: Adding second cron job" "$?" "$tmpfile" "$cmd"

# Rebuild cron jobs
cmd="v-rebuild-cron-jobs $user"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "CRON: Rebuilding cron jobs" "$?" "$tmpfile" "$cmd"


#----------------------------------------------------------#
#                          IP                              #
#----------------------------------------------------------#

# List network interfaces
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-list-sys-interfaces plain"
<<<<<<< HEAD
=======
cmd="$V_BIN/v_list_sys_interfaces plain"
>>>>>>> ab23882... Dockerfile
=======
cmd="v-list-sys-interfaces plain"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
interface=$($cmd 2> $tmpfile | head -n 1)
=======
interface=$($cmd > $tmpfile | head -n 1)
>>>>>>> 23c8197... Fix tests + docker permissioné
=======
interface=$($cmd 2> $tmpfile | head -n 1)
>>>>>>> 530253a... Fix tests
if [ -z "$interface" ]; then
    echo_result "IP: Listing network interfaces" "1" "$tmpfile" "$cmd"
else
    echo_result "IP: Listing network interfaces" "0" "$tmpfile" "$cmd"
fi

# Add ip address
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-sys-ip 198.18.0.123 255.255.255.255 $interface $user"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_sys_ip 198.18.0.123 255.255.255.255 $interface $user"
=======
cmd="v-add-sys-ip 198.18.0.123 255.255.255.255 $interface $user"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "IP: Adding ip 198.18.0.123" "$?" "$tmpfile" "$cmd"

# Add duplicate ip
$cmd > $tmpfile 2>&1
if [ "$?" -eq 4 ]; then
    retval=0
else
    retval=1
fi
echo_result "IP: Duplicate ip address check" "$retval" "$tmpfile" "$cmd"

# Delete ip address
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-delete-sys-ip 198.18.0.123"
$cmd > $tmpfile 2>&1
<<<<<<< HEAD
echo_result "IP: Deleting ip 198.18.0.123" "$?" "$tmpfile" "$cmd"

# Add ip address
cmd="v-add-sys-ip 198.18.0.125 255.255.255.255 $interface $user"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_delete_sys_ip 198.18.0.123"
=======
cmd="v-delete-sys-ip 198.18.0.123"
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
>>>>>>> a58f385... Fix tests
echo_result "IP: Deleting ip 198.18.0.123" "$?" "$tmpfile" "$cmd"

# Add ip address
cmd="v-add-sys-ip 198.18.0.125 255.255.255.255 $interface $user"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "IP: Adding ip 198.18.0.125" "$?" "$tmpfile" "$cmd"


#----------------------------------------------------------#
#                         WEB                              #
#----------------------------------------------------------#

# Add web domain
domain="test-$(random 4).vestacp.com"
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-web-domain $user $domain 198.18.0.125"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_web_domain $user $domain 198.18.0.125"
=======
cmd="v-add-web-domain $user $domain 198.18.0.125"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "WEB: Adding domain $domain on 198.18.0.125" "$?" "$tmpfile" "$cmd"

# Add duplicate
$cmd > $tmpfile 2>&1
if [ "$?" -eq 4 ]; then
    retval=0
else
    retval=1
fi
echo_result "WEB: Duplicate web domain check" "$retval" "$tmpfile" "$cmd"

# Add web domain alias
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-web-domain-alias $user $domain v3.$domain"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_web_domain_alias $user $domain v3.$domain"
=======
cmd="v_add_web_domain_alias $user $domain v3.$domain"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
=======
cmd="v-add-web-domain-alias $user $domain v3.$domain"
>>>>>>> cef45df... Fix tests
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "WEB: Adding alias v3.$domain" "$?" "$tmpfile" "$cmd"

# Alias duplicate
$cmd > $tmpfile 2>&1
if [ "$?" -eq 4 ]; then
    retval=0
else
    retval=1
fi
echo_result "WEB: Duplicate web alias check" "$retval" "$tmpfile" "$cmd"

<<<<<<< HEAD
<<<<<<< HEAD
# Add web domain stats
cmd="v-add-web-domain-stats $user $domain webalizer"
$cmd > $tmpfile 2>&1
echo_result "WEB: Enabling webalizer" "$?" "$tmpfile" "$cmd"

# Add web domain stats 
cmd="v-add-web-domain-stats-user $user $domain test m3g4p4ssw0rd"
$cmd > $tmpfile 2>&1
echo_result "WEB: Adding webalizer uzer" "$?" "$tmpfile" "$cmd"

# Add web domain nginx
#cmd="v-add-web-domain-nginx $user $domain"
#$cmd > $tmpfile 2>&1
#echo_result "WEB: Enabling nginx support" "$?" "$tmpfile" "$cmd"

# Suspend web domain
cmd="v-suspend-web-domain $user $domain"
$cmd > $tmpfile 2>&1
echo_result "WEB: Suspending web domain" "$?" "$tmpfile" "$cmd"

# Unsuspend web domain
cmd="v-unsuspend-web-domain $user $domain"
$cmd > $tmpfile 2>&1
=======
# Add web domain elog
cmd="v-add-web-domain-elog $user $domain"
$cmd > $tmpfile 2>&1
echo_result "WEB: Enabling error logging support" "$?" "$tmpfile" "$cmd"

# Disabling cgi
cmd="v-delete-web-domain-cgi $user $domain"
$cmd > $tmpfile 2>&1
echo_result "WEB: Disabling cgi support" "$?" "$tmpfile" "$cmd"

=======
>>>>>>> cef45df... Fix tests
# Add web domain stats
cmd="v-add-web-domain-stats $user $domain webalizer"
$cmd > $tmpfile 2>&1
echo_result "WEB: Enabling webalizer" "$?" "$tmpfile" "$cmd"

# Add web domain stats 
cmd="v-add-web-domain-stats-user $user $domain test m3g4p4ssw0rd"
$cmd > $tmpfile 2>&1
echo_result "WEB: Adding webalizer uzer" "$?" "$tmpfile" "$cmd"

# Add web domain nginx
#cmd="v-add-web-domain-nginx $user $domain"
#$cmd > $tmpfile 2>&1
#echo_result "WEB: Enabling nginx support" "$?" "$tmpfile" "$cmd"

# Suspend web domain
cmd="v-suspend-web-domain $user $domain"
$cmd > $tmpfile 2>&1
echo_result "WEB: Suspending web domain" "$?" "$tmpfile" "$cmd"

# Unsuspend web domain
cmd="v-unsuspend-web-domain $user $domain"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "WEB: Unsuspending web domain" "$?" "$tmpfile" "$cmd"

# Add web domain ssl
cp $V_TEST/ssl/crt /tmp/$domain.crt
cp $V_TEST/ssl/key /tmp/$domain.key
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-web-domain-ssl $user $domain /tmp"
$cmd > $tmpfile 2>&1
<<<<<<< HEAD
=======
cmd="$V_BIN/v_add_web_domain_ssl $user $domain /tmp"
=======
cmd="v-add-web-domain-ssl $user $domain /tmp"
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
>>>>>>> a58f385... Fix tests
echo_result "WEB: Adding ssl support" "$?" "$tmpfile" "$cmd"

# Rebuild web domains
cmd="v-rebuild-web-domains $user"
<<<<<<< HEAD
<<<<<<< HEAD
$cmd > $tmpfile 2>&1
=======
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> 455bcfa... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "WEB: rebuilding web domains" "$?" "$tmpfile" "$cmd"


#----------------------------------------------------------#
#                         DNS                              #
#----------------------------------------------------------#

# Add dns domain
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-dns-domain $user $domain 198.18.0.125"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_dns_domain $user $domain 198.18.0.125"
=======
cmd="v-add-dns-domain $user $domain 198.18.0.125"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "DNS: Adding dns domain $domain" "$?" "$tmpfile" "$cmd"

# Add duplicate
$cmd > $tmpfile 2>&1
if [ "$?" -eq 4 ]; then
    retval=0
else
    retval=1
fi
echo_result "DNS: Duplicate domain check" "$retval" "$tmpfile" "$cmd"

# Add dns domain record
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-dns-record $user $domain test A 198.18.0.125 20"
$cmd > $tmpfile 2>&1
echo_result "DNS: Adding dns record" "$?" "$tmpfile" "$cmd"
=======
cmd="$V_BIN/v_add_dns_domain_record $user $domain test A 198.18.0.125 20"
=======
cmd="v-add-dns-domain-record $user $domain test A 198.18.0.125 20"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "DNS: Adding dns domain record" "$?" "$tmpfile" "$cmd"
>>>>>>> ab23882... Dockerfile
=======
cmd="v-add-dns-record $user $domain test A 198.18.0.125 20"
$cmd > $tmpfile 2>&1
echo_result "DNS: Adding dns record" "$?" "$tmpfile" "$cmd"
>>>>>>> 327b35b... Fix tests

# Add duplicate
$cmd > $tmpfile 2>&1
if [ "$?" -eq 4 ]; then
    retval=0
else
    retval=1
fi
echo_result "DNS: Duplicate record check" "$retval" "$tmpfile" "$cmd"

# Delete dns domain record
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-delete-dns-record $user $domain 20"
$cmd > $tmpfile 2>&1
echo_result "DNS: Deleteing dns domain record" "$?" "$tmpfile" "$cmd"

# Change exp
cmd="v-change-dns-domain-exp $user $domain 2020-01-01"
$cmd > $tmpfile 2>&1
echo_result "DNS: Changing expiriation date" "$?" "$tmpfile" "$cmd"

# Change ip
cmd="v-change-dns-domain-ip $user $domain 127.0.0.1"
$cmd > $tmpfile 2>&1
echo_result "DNS: Changing domain ip" "$?" "$tmpfile" "$cmd"

# Suspend dns domain
cmd="v-suspend-dns-domain $user $domain"
$cmd > $tmpfile 2>&1
echo_result "DNS: Suspending domain" "$?" "$tmpfile" "$cmd"

# Unuspend dns domain
cmd="v-unsuspend-dns-domain $user $domain"
$cmd > $tmpfile 2>&1
echo_result "DNS: Unsuspending domain" "$?" "$tmpfile" "$cmd"

# Rebuild dns domain
cmd="v-rebuild-dns-domains $user"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_delete_dns_domain_record $user $domain 20"
=======
cmd="v-delete-dns-domain-record $user $domain 20"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
=======
cmd="v-delete-dns-record $user $domain 20"
>>>>>>> 074712f... Fix tests
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "DNS: Deleteing dns domain record" "$?" "$tmpfile" "$cmd"

# Change exp
cmd="v-change-dns-domain-exp $user $domain 2020-01-01"
$cmd > $tmpfile 2>&1
echo_result "DNS: Changing expiriation date" "$?" "$tmpfile" "$cmd"

# Change ip
cmd="v-change-dns-domain-ip $user $domain 127.0.0.1"
$cmd > $tmpfile 2>&1
echo_result "DNS: Changing domain ip" "$?" "$tmpfile" "$cmd"

# Suspend dns domain
cmd="v-suspend-dns-domain $user $domain"
$cmd > $tmpfile 2>&1
echo_result "DNS: Suspending domain" "$?" "$tmpfile" "$cmd"

# Unuspend dns domain
cmd="v-unsuspend-dns-domain $user $domain"
$cmd > $tmpfile 2>&1
echo_result "DNS: Unsuspending domain" "$?" "$tmpfile" "$cmd"

# Rebuild dns domain
cmd="v-rebuild-dns-domains $user"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "DNS: Rebuilding domain" "$?" "$tmpfile" "$cmd"


# Add mail domain
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-mail-domain $user $domain"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_mail_domain $user $domain"
=======
cmd="v-add-mail-domain $user $domain"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "Adding mail domain $domain" "$?" "$tmpfile" "$cmd"

# Add mysql database
database=d$(random 4)
<<<<<<< HEAD
<<<<<<< HEAD
cmd="v-add-database $user $database $database dbp4ssw0rd mysql"
$cmd > $tmpfile 2>&1
echo_result "Adding mysql database $database" "$?" "$tmpfile" "$cmd"

# Add pgsql database
#database=d$(random 4)
#cmd="v-add-database $user $database $database dbp4ssw0rd pgsql"
#$cmd > $tmpfile 2>&1
#echo_result "Adding pgsql database $database" "$?" "$tmpfile" "$cmd"

# Rebuild user configs
cmd="v-rebuild-user $user yes"
$cmd > $tmpfile 2>&1
echo_result "Rebuilding user config" "$?" "$tmpfile" "$cmd"

# Delete user
cmd="v-delete-user $user"
$cmd > $tmpfile 2>&1
echo_result "Deleting user $user" "$?" "$tmpfile" "$cmd"

# Delete ip address
cmd="v-delete-sys-ip 198.18.0.125"
$cmd > $tmpfile 2>&1
=======
cmd="$V_BIN/v_add_database $user $database $database dbp4ssw0rd mysql"
=======
cmd="v-add-database $user $database $database dbp4ssw0rd mysql"
<<<<<<< HEAD
>>>>>>> 455bcfa... Dockerfile
$cmd > $tmpfile 2>> $tmpfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "Adding mysql database $database" "$?" "$tmpfile" "$cmd"

# Add pgsql database
#database=d$(random 4)
#cmd="v-add-database $user $database $database dbp4ssw0rd pgsql"
#$cmd > $tmpfile 2>&1
#echo_result "Adding pgsql database $database" "$?" "$tmpfile" "$cmd"

# Rebuild user configs
cmd="v-rebuild-user $user yes"
$cmd > $tmpfile 2>&1
echo_result "Rebuilding user config" "$?" "$tmpfile" "$cmd"

# Delete user
cmd="v-delete-user $user"
$cmd > $tmpfile 2>&1
echo_result "Deleting user $user" "$?" "$tmpfile" "$cmd"

# Delete ip address
cmd="v-delete-sys-ip 198.18.0.125"
<<<<<<< HEAD
$cmd > $tmpfile 2>> $tmpfile
>>>>>>> ab23882... Dockerfile
=======
$cmd > $tmpfile 2>&1
>>>>>>> a58f385... Fix tests
echo_result "Deleting ip 198.18.0.125" "$?" "$tmpfile" "$cmd"

