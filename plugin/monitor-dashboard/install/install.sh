#!/bin/bash
# info: install Monitor dashboard plugin
# options: 
#
# Install Monitor dashboard plugin

#----------------------------------------------------------#
#                    Variable&Function                     #
#----------------------------------------------------------#

# Includes
source $VESTA/func/main.sh
source $VESTA/conf/vesta.conf

# Additional argument formatting

#----------------------------------------------------------#
#                    Verifications                         #
#----------------------------------------------------------#



#----------------------------------------------------------#
#                       Action                             #
#----------------------------------------------------------#

#yum install -y https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-4.5.2-1.x86_64.rpm
yum install -y fontconfig freetype* urw-fonts

systemctl daemon-reload
sudo systemctl enable grafana-server.service
systemctl start grafana-server

cp $VESTA/plugin/monitor-dashboard/grafana/grafana.ini /etc/grafana/grafana.ini
cp $VESTA/plugin/monitor-dashboard/grafana/ldap.toml /etc/grafana/ldap.toml

grafana-cli plugins install raintank-worldping-app
grafana-cli plugins install grafana-piechart-panel

#Apache
#https://grafana.com/dashboards/2914

#NGINX
#https://grafana.com/dashboards/462
#https://grafana.com/dashboards/3096
#https://grafana.com/dashboards/1623

# Node
#https://grafana.com/dashboards/3191
#https://grafana.com/dashboards/3011
#https://grafana.com/dashboards/3002
#https://grafana.com/dashboards/3086
#https://grafana.com/dashboards/3005
#https://grafana.com/dashboards/3089
#https://grafana.com/dashboards/1856
#https://grafana.com/dashboards/2939
#https://grafana.com/dashboards/1860
#https://grafana.com/dashboards/405

#----------------------------------------------------------#
#                       Vesta                              #
#----------------------------------------------------------#

exit $RESULT
