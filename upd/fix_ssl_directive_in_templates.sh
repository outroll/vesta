#!/bin/bash

release=$(cat /etc/debian_version | tr "." "\n" | head -n1)

if [ "$release" -eq 9 ] || [ "$release" -eq 10 ]; then
    for FILE in /usr/local/vesta/data/templates/web/nginx/*.stpl; do
        check_grep=$(grep -c 'http2' $FILE)
        if [ "$check_grep" -eq 0 ]; then
            echo "=== Fixing http2 directive in $FILE"
            sed -i "s|:%proxy_ssl_port%;|:%proxy_ssl_port% ssl http2;|g" $FILE
        fi
        check_grep=$(grep -c 'ssl *on;' $FILE)
        if [ "$check_grep" -gt 0 ]; then
            echo "=== Fixing ssl directive in $FILE"
            sed -i "s|ssl *on;|#ssl_on;|g" $FILE
        fi
    done
fi

for user in $(grep '@' /etc/passwd |cut -f1 -d:); do
    if [ ! -f "/usr/local/vesta/data/users/$user/user.conf" ]; then
        continue;
    fi
    v-rebuild-web-domains $user 'no'
done
