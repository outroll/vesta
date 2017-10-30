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

#Low memory server:
#https://discuss.elastic.co/t/running-es-5-on-a-low-memory-server-for-testing/65336/4


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
