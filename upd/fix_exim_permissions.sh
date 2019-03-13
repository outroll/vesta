#!/bin/bash

# Define mail user
if [ "$MAIL_SYSTEM" = 'exim4' ]; then
    MAIL_USER=Debian-exim
else
    MAIL_USER=exim
fi

if [ -e "/etc/exim4/domains/" ]; then
    for domain in $(ls /etc/exim4/domains/); do
        domain_link=$(readlink /etc/exim4/domains/$domain)
        chown $MAIL_USER:mail $domain_link
        chown $MAIL_USER:mail /etc/exim4/domains/$domain/*
    
        # Checking if user dovecot exists. If dovecor user doesn't exist (dovecot is not installed), owner is exim user.
        if id "dovecot" >/dev/null 2>&1; then
            chown -R dovecot:mail /etc/exim4/domains/$domain/passwd
        else
            chown -R $MAIL_USER:mail /etc/exim4/domains/$domain/passwd
        fi
    done
fi

exit
