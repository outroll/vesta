#!/bin/bash
source /etc/profile.d/vesta.sh
source /usr/local/vesta/func/main.sh

touch $VESTA/conf/plugin.conf
echo "PLUGIN='hello-world' NAME='Hello World' VERSION='1.0.0' BUILDNUMBER='1' LATEST_VERSION='1.0.0' LATEST_BUILDNUMBER='1' KEY='' ACTIVE='yes' TIME='22:28:00' DATE='2017-09-23'" >> $VESTA/conf/plugin.conf 