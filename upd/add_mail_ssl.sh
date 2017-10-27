#!/bin/bash

#Add SSL to all mail domains

#Add U_MAIL_SSL='0' to all users

userlist=$(ls --sort=time $VESTA/data/users/)
for user in $userlist; do
    USER_DATA="$VESTA/data/users/$user"

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
