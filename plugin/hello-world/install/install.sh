#!/bin/bash
# info: install hello-world plugin
# options: [RESTART]
#
# Install hello-world plugin


#----------------------------------------------------------#
#                    Variable&Function                     #
#----------------------------------------------------------#

# Argument definition
restart="${1-yes}"

# Includes
source $VESTA/func/main.sh
source $VESTA/conf/vesta.conf

# Additional argument formatting

#----------------------------------------------------------#
#                    Verifications                         #
#----------------------------------------------------------#
check_args '0' "$#" '[RESTART]'


#----------------------------------------------------------#
#                       Action                             #
#----------------------------------------------------------#

#Nothing to do...


#----------------------------------------------------------#
#                       Vesta                              #
#----------------------------------------------------------#

if [ "$restart" = "yes" ];
    echo "Restarting services";
fi

exit
