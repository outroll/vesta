#!/bin/bash
# info: install hello-world plugin
# options: $STARTVERSION $ENDVERSION [RESTART]
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


if [ "$STARTVERSION" = "0.0.0" && "$ENDVERSION" = "1.0.1" ];
    echo "Update from $STARTVERSION to $ENDVERSION"
fi

#----------------------------------------------------------#
#                       Vesta                              #
#----------------------------------------------------------#

if [ "$restart" = "yes" ];
    echo "Restarting services";
fi

exit
