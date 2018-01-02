#!/bin/bash

source /etc/profile.d/vesta.sh
source /usr/local/vesta/func/main.sh

#Letsencrypt for panel
if [ -z "$(grep "LETSENCRYPT" $VESTA/conf/vesta.conf)" ]; then
    echo "LETSENCRYPT='no'" >> $VESTA/conf/vesta.conf
else
    sed -i "s/LETSENCRYPT=.*/LETSENCRYPT='no'/g" $VESTA/conf/vesta.conf
fi

#Update per user
userlist=$(ls --sort=time $VESTA/data/users/)
for user in $userlist; do
    USER_DATA="$VESTA/data/users/$user"
    
    #Update user counter
    if [ -z "$(grep "U_MAIL_SSL" $USER_DATA/user.conf)" ]; then
        echo "U_MAIL_SSL='0'" >> $USER_DATA/user.conf
    else
        sed -i "s/U_MAIL_SSL=.*/U_MAIL_SSL='0'/g" $USER_DATA/user.conf
    fi

    #UPDATE mail
    conf="$USER_DATA/mail.conf"
    while read line ; do
        eval $line
        
        add_object_key "mail" 'DOMAIN' "$DOMAIN" 'SSL' 'SUSPENDED'
        update_object_value 'mail' 'DOMAIN' "$DOMAIN" '$SSL' 'no'
        
        add_object_key "mail" 'DOMAIN' "$DOMAIN" 'LETSENCRYPT' 'SUSPENDED'
        update_object_value 'mail' 'DOMAIN' "$DOMAIN" '$LETSENCRYPT' 'no'
    done < $conf
done

