#!/bin/bash

#Add SSL to all mail domains

#Add U_MAIL_SSL='0' to all users


add_object_key "mail" 'DOMAIN' "$domain_idn" 'LETSENCRYPT' 'SUSPENDED'
update_object_value 'mail' 'DOMAIN' "$domain_idn" '$LETSENCRYPT' 'no'