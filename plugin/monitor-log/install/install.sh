#!/bin/bash
# info: install log monitor dashboard plugin
# options: 
#
# Install log monitor dashboard plugin

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

#https://www.digitalocean.com/community/tutorials/how-to-install-elasticsearch-logstash-and-kibana-elk-stack-on-centos-7

#Modules
#https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-nginx.html

#filebeat.modules:
#- module: apache2
#  access:
#    var.paths: ["/var/log/httpd/domains/*.access.log"]
#  error:
#    var.paths: ["/var/log/httpd/domains/*.error.log"]
#- module: nginx
#  access:
#    var.paths: ["/var/log/nginx/domains/*.access.log"]
#  error:
#    var.paths: ["/var/log/nginx/domains/*.error.log"]
#- module: mysql
#  error:
#    enabled: true
#    var.paths: ["/var/log/mariadb/mariadb.log"]
#  slowlog:
#    enabled: true
#    var.paths: ["/path/to/log/mysql/mysql-slow.log*"]
#- module: system
#  syslog:
#    enabled: true
#    var.paths: ["/var/log/messages"]
#  auth:
#    enabled: true
#    var.paths: ["/var/log/secure"]


#----------------------------------------------------------#
#                       Action                             #
#----------------------------------------------------------#

INSTALL_FILEBEAT='yes'

#Install filebeat
if [ "$INSTALL_FILEBEAT" = 'yes' ]; then
    cp $VESTA/plugin/monitor-log-dashboard/ssl/* $VESTA/plugin/monitor-log/ssl/
    sudo rpm --import http://packages.elastic.co/GPG-KEY-elasticsearch
    echo '[beats-5.x]' > /etc/yum.repos.d/elastic-beats.repo
    echo 'name=Elasticsearch repository for 5.x packages' >> /etc/yum.repos.d/elastic-beats.repo
    echo 'baseurl=https://artifacts.elastic.co/packages/5.x/yum' >> /etc/yum.repos.d/elastic-beats.repo
    echo 'gpgcheck=1' >> /etc/yum.repos.d/elastic-beats.repo
    echo 'gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch' >> /etc/yum.repos.d/elastic-beats.repo
    echo 'enabled=1' >> /etc/yum.repos.d/elastic-beats.repo
    echo 'autorefresh=1' >> /etc/yum.repos.d/elastic-beats.repo
    echo 'type=rpm-md' >> /etc/yum.repos.d/elastic-beats.repo
    sudo yum -y install filebeat
    
    cp $VESTA/plugin/monitor-log/conf/filebeat.yml /etc/filebeat/filebeat.yml
    
    sudo systemctl start filebeat
    sudo systemctl enable filebeat
fi

#----------------------------------------------------------#
#                       Vesta                              #
#----------------------------------------------------------#

exit $RESULT
