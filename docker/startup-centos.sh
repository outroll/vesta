#!/bin/bash

export TERM=xterm

PATH=$PATH:/usr/local/vesta/bin
export PATH

/bin/bash /vesta/install/vst-install-rhel-docker.sh --nginx yes --apache yes \
  --phpfpm no --named yes --remi yes --vsftpd no --proftpd no --iptables no \
  --fail2ban no --quota no --exim yes --dovecot yes --spamassassin no --clamav no \
  --mysql yes --postgresql no --hostname example.com --email test@example.com \
  --password admin -y no --force

#RUN cd /usr/local/vesta/data/ips && mv * 127.0.0.1 \
#    && cd /etc/httpd/conf.d && sed -i -- 's/172.*.*.*:80/127.0.0.1:80/g' * && sed -i -- 's/172.*.*.*:8443/127.0.0.1:8443/g' * \
#    && cd /etc/nginx/conf.d && sed -i -- 's/172.*.*.*:80;/80;/g' * && sed -i -- 's/172.*.*.*:8080/127.0.0.1:8080/g' * \
#    && cd /home/admin/conf/web && sed -i -- 's/172.*.*.*:80;/80;/g' * && sed -i -- 's/172.*.*.*:8080/127.0.0.1:8080/g' *

chmod +x /vesta/docker/startup-centos.sh
/bin/bash -c "source /etc/profile.d/vesta.sh"
/vesta/docker/startup-centos.sh
/usr/sbin/init

#starting Vesta
cd /etc/init.d/ \
&& ./vesta start \
&& ./mysqld start \
&& ./bind start \
&& ./nginx start \
&& ./exim4 start \
&& ./httpd start \
&& ./dovecot start