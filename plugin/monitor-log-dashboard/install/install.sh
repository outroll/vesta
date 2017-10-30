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

INSTALL_JAVA='yes'
INSTALL_ELASTICSEARCH='yes'
INSTALL_KIBANA='yes'
INSTALL_NGINX='yes'
INSTALL_LOGSTASH='yes'

DOMAINNAME="logging.$(hostname)"

sudo systemctl stop elasticsearch
sudo systemctl stop kibana
sudo systemctl stop logstash

sudo systemctl restart elasticsearch
sudo systemctl restart kibana
sudo systemctl restart logstash

#Install java
if [ "$INSTALL_JAVA" = 'yes' ]; then
    wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u151-b12/e758a0de34e24606bca991d704f6dcbf/jdk-8u151-linux-x64.rpm"
    sudo yum -y localinstall jdk-8u151-linux-x64.rpm
    rm jdk-8u*-linux-x64.rpm
fi

#Install Elasticsearch
if [ "$INSTALL_ELASTICSEARCH" = 'yes' ]; then
    sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
    echo '[elasticsearch-5.x]' > /etc/yum.repos.d/elasticsearch.repo
    echo 'name=Elasticsearch repository for 5.x packages' >> /etc/yum.repos.d/elasticsearch.repo
    echo 'baseurl=https://artifacts.elastic.co/packages/5.x/yum' >> /etc/yum.repos.d/elasticsearch.repo
    echo 'gpgcheck=1' >> /etc/yum.repos.d/elasticsearch.repo
    echo 'gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch' >> /etc/yum.repos.d/elasticsearch.repo
    echo 'enabled=1' >> /etc/yum.repos.d/elasticsearch.repo
    echo 'autorefresh=1' >> /etc/yum.repos.d/elasticsearch.repo
    echo 'type=rpm-md' >> /etc/yum.repos.d/elasticsearch.repo
    sudo yum -y install elasticsearch

    cp $VESTA/plugin/monitor-log-dashboard/conf/elasticsearch.yml /etc/elasticsearch/elasticsearch.yml

    sudo systemctl daemon-reload
    sudo systemctl start elasticsearch
    sudo systemctl enable elasticsearch
fi

#Install kibana
if [ "$INSTALL_KIBANA" = 'yes' ]; then
    echo '[kibana-5.x]' > /etc/yum.repos.d/kibana.repo
    echo 'name=Kibana repository for 5.x packages' >> /etc/yum.repos.d/kibana.repo
    echo 'baseurl=https://artifacts.elastic.co/packages/5.x/yum' >> /etc/yum.repos.d/kibana.repo
    echo 'gpgcheck=1' >> /etc/yum.repos.d/kibana.repo
    echo 'gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch' >> /etc/yum.repos.d/kibana.repo
    echo 'enabled=1' >> /etc/yum.repos.d/kibana.repo
    echo 'autorefresh=1' >> /etc/yum.repos.d/kibana.repo
    echo 'type=rpm-md' >> /etc/yum.repos.d/kibana.repo
    sudo yum -y install kibana

    #cp $VESTA/plugin/monitor-log-dashboard/conf/kibana.yml /opt/kibana/config/kibana.yml

    sudo systemctl start kibana
    sudo chkconfig kibana on
fi

if [ "$INSTALL_NGINX" = 'yes' ]; then
    #Add nginx template
    cp $VESTA/plugin/monitor-log-dashboard/conf/kibana.*pl /$VESTA/data/templates/web/nginx/

    #Add domain to admin user
    $VESTA/bin/v-add-domain admin $DOMAINNAME
    $VESTA/bin/v-change-web-domain-proxy-tpl admin $DOMAINNAME kibana
    #Add basic authentication
    $VESTA/bin/v-add-web-domain-httpauth admin $DOMAINNAME kibana kibana yes yes
fi

#Install Logstash
if [ "$INSTALL_LOGSTASH" = 'yes' ]; then
    echo '[logstash-5.x]' > /etc/yum.repos.d/logstash.repo
    echo 'name=Elastic repository for 5.x packages' >> /etc/yum.repos.d/logstash.repo
    echo 'baseurl=https://artifacts.elastic.co/packages/5.x/yum' >> /etc/yum.repos.d/logstash.repo
    echo 'gpgcheck=1' >> /etc/yum.repos.d/logstash.repo
    echo 'gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch' >> /etc/yum.repos.d/logstash.repo
    echo 'enabled=1' >> /etc/yum.repos.d/logstash.repo
    echo 'autorefresh=1' >> /etc/yum.repos.d/logstash.repo
    echo 'type=rpm-md' >> /etc/yum.repos.d/logstash.repo
    sudo yum -y install logstash

    cd $VESTA/plugin/monitor-log-dashboard/ssl
    #sudo openssl req -subj '/CN=$DOMAINNAME/' -x509 -days 3650 -batch -nodes -newkey rsa:2048 -keyout logstash-forwarder.key -out logstash-forwarder.crt

    cp $VESTA/plugin/monitor-log-dashboard/conf/logstash.yml /etc/logstash/logstash.yml

    cp $VESTA/plugin/monitor-log-dashboard/conf/02-beats-input.conf /etc/logstash/conf.d/02-beats-input.conf
    cp $VESTA/plugin/monitor-log-dashboard/conf/10-syslog-filter.conf /etc/logstash/conf.d/10-syslog-filter.conf
    #cp $VESTA/plugin/monitor-log-dashboard/conf/11-nginx-filter.conf /etc/logstash/conf.d/11-nginx-filter.conf
    cp $VESTA/plugin/monitor-log-dashboard/conf/30-elasticsearch-output.conf /etc/logstash/conf.d/30-elasticsearch-output.conf
    sudo service logstash configtest

    sudo systemctl restart logstash
    sudo chkconfig logstash on


    cd $VESTA/plugin/monitor-log-dashboard/dashboard
    curl -O https://gist.githubusercontent.com/thisismitch/3429023e8438cc25b86c/raw/d8c479e2a1adcea8b1fe86570e42abab0f10f364/filebeat-index-template.json
    curl -XPUT 'http://localhost:9200/_template/filebeat?pretty' -d@filebeat-index-template.json
fi

#----------------------------------------------------------#
#                       Vesta                              #
#----------------------------------------------------------#

exit $RESULT
