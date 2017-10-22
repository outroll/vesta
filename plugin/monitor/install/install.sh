#!/bin/bash
# info: install Monitor plugin
# options: 
#
# Install Monitor plugin

# Node exporter = V0.15.0 -> Port 9100
# MySQL exporter = V0.10.0 -> Port 9104
# Nginx exporter = V0.1.0 -> Port 9113 / https://github.com/c4milo/nginx_exporter/releases
# Apache exporter = V0.4.0 -> Port 9117 / https://github.com/Lusitaniae/apache_exporter

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

#Node exporter
echo "[Unit]" > /etc/systemd/system/node_exporter.service
echo "Description=Node Exporter" >> /etc/systemd/system/node_exporter.service
echo "" >> /etc/systemd/system/node_exporter.service
echo "[Service]" >> /etc/systemd/system/node_exporter.service
echo "User=root" >> /etc/systemd/system/node_exporter.service
echo "ExecStart=$PLUGIN/monitor/exporters/node_exporter --collector.systemd" >> /etc/systemd/system/node_exporter.service
echo "" >> /etc/systemd/system/node_exporter.service
echo "[Install]" >> /etc/systemd/system/node_exporter.service
echo "WantedBy=default.target" >> /etc/systemd/system/node_exporter.service


systemctl daemon-reload
systemctl enable node_exporter.service
systemctl start node_exporter.service

hostname=$(hostname)

$PLUGIN/monitor/bin/v-add-monitor-target "prometheus" "$hostname" "9090" "no"
$PLUGIN/monitor/bin/v-add-monitor-target "node" "$hostname" "9100" "no"

if [ "$DB_SYSTEM" == "mysql" ]; then 
    #Mysql exporter
    echo "[Unit]" > /etc/systemd/system/mysqld_exporter.service
    echo "Description=MySQL Exporter" >> /etc/systemd/system/mysqld_exporter.service
    echo "" >> /etc/systemd/system/mysqld_exporter.service
    echo "[Service]" >> /etc/systemd/system/mysqld_exporter.service
    echo "User=root" >> /etc/systemd/system/mysqld_exporter.service
    echo "ExecStart=$PLUGIN/monitor/exporters/mysqld_exporter" >> /etc/systemd/system/mysqld_exporter.service
    echo "" >> /etc/systemd/system/mysqld_exporter.service
    echo "[Install]" >> /etc/systemd/system/mysqld_exporter.service
    echo "WantedBy=default.target" >> /etc/systemd/system/mysqld_exporter.service

    if grep -q user /root/.my.cnf
    then
        echo "user='root'" >> /root/.my.cnf
    fi

    systemctl daemon-reload
    systemctl enable mysqld_exporter.service
    systemctl start mysqld_exporter.service
    
    
    $PLUGIN/monitor/bin/v-add-monitor-target "mysql" "$hostname" "9104" "no"
fi

if [ "$PROXY_SYSTEM" == "nginx" ]; then
    #Nginx exporter
    echo "[Unit]" > /etc/systemd/system/nginx_exporter.service
    echo "Description=Nginx Exporter" >> /etc/systemd/system/nginx_exporter.service
    echo "" >> /etc/systemd/system/nginx_exporter.service
    echo "[Service]" >> /etc/systemd/system/nginx_exporter.service
    echo "User=root" >> /etc/systemd/system/nginx_exporter.service
    echo "ExecStart=$PLUGIN/monitor/exporters/nginx_exporter -nginx.scrape_uri=http://172.0.0.1:8084/nginx_status" >> /etc/systemd/system/nginx_exporter.service
    echo "" >> /etc/systemd/system/nginx_exporter.service
    echo "[Install]" >> /etc/systemd/system/nginx_exporter.service
    echo "WantedBy=default.target" >> /etc/systemd/system/nginx_exporter.service

    systemctl daemon-reload
    systemctl enable nginx_exporter.service
    systemctl start nginx_exporter.service
    
    $PLUGIN/monitor/bin/v-add-monitor-target "nginx" "$hostname" "9113" "no"
fi

if [ "$WEB_SYSTEM" == "httpd" ]; then
    #Apache exporter
    echo "[Unit]" > /etc/systemd/system/apache_exporter.service
    echo "Description=Apache Exporter" >> /etc/systemd/system/apache_exporter.service
    echo "" >> /etc/systemd/system/apache_exporter.service
    echo "[Service]" >> /etc/systemd/system/apache_exporter.service
    echo "User=root" >> /etc/systemd/system/apache_exporter.service
    echo "ExecStart=$PLUGIN/monitor/exporters/apache_exporter -scrape_uri=http://localhost:8081/server-status/?auto" >> /etc/systemd/system/apache_exporter.service
    echo "" >> /etc/systemd/system/apache_exporter.service
    echo "[Install]" >> /etc/systemd/system/apache_exporter.service
    echo "WantedBy=default.target" >> /etc/systemd/system/apache_exporter.service

    systemctl daemon-reload
    systemctl enable apache_exporter.service
    systemctl start apache_exporter.service
    
    $PLUGIN/monitor/bin/v-add-monitor-target "apache" "$hostname" "9117" "no"
fi


#Prometheus exporter
echo "[Unit]" > /etc/systemd/system/prometheus.service
echo "Description=Prometheus" >> /etc/systemd/system/prometheus.service
echo "" >> /etc/systemd/system/prometheus.service
echo "[Service]" >> /etc/systemd/system/prometheus.service
echo "User=root" >> /etc/systemd/system/prometheus.service
echo "ExecStart=$PLUGIN/monitor/prometheus/prometheus -config.file=$PLUGIN/monitor/prometheus/prometheus.yml" >> /etc/systemd/system/prometheus.service
echo "" >> /etc/systemd/system/prometheus.service
echo "[Install]" >> /etc/systemd/system/prometheus.service
echo "WantedBy=default.target" >> /etc/systemd/system/prometheus.service


$PLUGIN/monitor/bin/v-rebuild-monitor-targets "no"

systemctl daemon-reload
systemctl enable prometheus.service
systemctl start prometheus.service



#----------------------------------------------------------#
#                       Vesta                              #
#----------------------------------------------------------#

exit $RESULT
