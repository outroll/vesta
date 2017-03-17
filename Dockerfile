FROM phusion/baseimage:0.9.15
MAINTAINER "Made I.T." <tjebbe.lievens@madeit.be>

ENV VESTA /usr/local/vesta

RUN apt-get update \
 && apt-get -y upgrade \
 && apt-get -y install git unzip nano \
 && apt-get clean

apt=/etc/apt/sources.list.d
RUN echo "deb http://nginx.org/packages/mainline/ubuntu/ 16.10 nginx" > /etc/apt/sources.list.d/nginx.list \
 && wget http://nginx.org/keys/nginx_signing.key -O /tmp/nginx_signing.key \
 && apt-key add /tmp/nginx_signing.key

RUN echo -e '#!/bin/sh \nexit 101' > /usr/sbin/policy-rc.d \
 && chmod a+x /usr/sbin/policy-rc.d

RUN apt-get install nginx apache2 apache2-utils apache2.2-common \
    apache2-suexec-custom libapache2-mod-ruid2 libapache2-mod-rpaf \
    libapache2-mod-fcgid libapache2-mod-php7.0 php7.0 php7.0-common php7.0-cgi \
    php7.0-mysql php7.0-curl awstats webalizer vsftpd bind9 exim4 exim4-daemon-heavy \
    clamav-daemon spamassassin dovecot-imapd dovecot-pop3d roundcube-core \
    roundcube-mysql roundcube-plugins mysql-server mysql-common \
    mysql-client phpmyadmin mc \
    flex whois rssh git idn zip sudo bc ftp lsof ntpdate rrdtool quota \
    e2fslibs bsdutils e2fsprogs curl imagemagick fail2ban dnsutils \
    bsdmainutils cron expect \
 && apt-get clean \
 && rm -f /usr/sbin/policy-rc.d



#----------------------------------------------------------#
#                     Configure system                     #
#----------------------------------------------------------#

# Enable SSH password auth
RUN sed -i "s/rdAuthentication no/rdAuthentication yes/g" /etc/ssh/sshd_config \
 && echo 'LS_COLORS="$LS_COLORS:di=00;33"' >> /etc/profile \
 && echo "/sbin/nologin" >> /etc/shells \
 && sed -i 's/#allowscp/allowscp/' /etc/rssh.conf \
 && sed -i 's/#allowsftp/allowsftp/' /etc/rssh.conf \
 && sed -i 's/#allowrsync/allowrsync/' /etc/rssh.conf \
 && chmod 755 /usr/bin/rssh


#----------------------------------------------------------#
#                     Configure VESTA                      #
#----------------------------------------------------------#

# AppArmor
RUN aa-complain /usr/sbin/named 2>/dev/null \
 && mkdir -p /etc/sudoers.d;

ADD install/ubuntu/16.10/sudo/admin /etc/sudoers.d/admin
RUN chmod 440 /etc/sudoers.d/admin \
 && echo "export VESTA='/usr/local/vesta'" > /etc/profile.d/vesta.sh \
 && chmod 755 /etc/profile.d/vesta.sh \
 && source /etc/profile.d/vesta.sh \
 && echo 'PATH=$PATH:/usr/local/vesta/bin' >> /root/.bash_profile \
 && echo 'export PATH' >> /root/.bash_profile \
 && source /root/.bash_profile

ADD install/ubuntu/16.10/logrotate/vesta /etc/logrotate.d/vesta


# Buidling directory tree and creating some blank files for vesta
RUN mkdir -p $VESTA/conf $VESTA/log $VESTA/ssl $VESTA/data/ips \
    $VESTA/data/queue $VESTA/data/users $VESTA/data/firewall \
 && touch $VESTA/data/queue/backup.pipe $VESTA/data/queue/disk.pipe \
    $VESTA/data/queue/webstats.pipe $VESTA/data/queue/restart.pipe \
    $VESTA/data/queue/traffic.pipe $VESTA/log/system.log \
    $VESTA/log/nginx-error.log $VESTA/log/auth.log \
 && chmod 750 $VESTA/conf $VESTA/data/users $VESTA/data/ips $VESTA/log \
 && chmod -R 750 $VESTA/data/queue \
 && chmod 660 $VESTA/log/* \
 && rm -f /var/log/vesta \
 && ln -s /usr/local/vesta/log /var/log/vesta \

# Generating vesta configuration
RUN rm -f $VESTA/conf/vesta.conf 2>/dev/null \
 && touch $VESTA/conf/vesta.conf \
 && chmod 660 $VESTA/conf/vesta.conf

# WEB stack
RUN echo "WEB_SYSTEM='nginx'" >> $VESTA/conf/vesta.conf \
 && echo "WEB_PORT='80'" >> $VESTA/conf/vesta.conf \
 && echo "WEB_SSL_PORT='443'" >> $VESTA/conf/vesta.conf \
 && echo "WEB_SSL='openssl'"  >> $VESTA/conf/vesta.conf \
 && echo "WEB_BACKEND='php7.0-fpm'" >> $VESTA/conf/vesta.conf \
 && echo "STATS_SYSTEM='webalizer,awstats'" >> $VESTA/conf/vesta.conf \
 && echo "DNS_SYSTEM='bind9'" >> $VESTA/conf/vesta.conf \
 && echo "MAIL_SYSTEM='exim4'" >> $VESTA/conf/vesta.conf \
 && echo "IMAP_SYSTEM='dovecot'" >> $VESTA/conf/vesta.conf \
 && echo "CRON_SYSTEM='cron'" >> $VESTA/conf/vesta.conf \
 && echo "BACKUP_SYSTEM='local'" >> $VESTA/conf/vesta.conf \
 && echo "LANGUAGE='en'" >> $VESTA/conf/vesta.conf \
 && echo "VERSION='0.9.8'" >> $VESTA/conf/vesta.conf
 
# Downloading hosting packages
ADD install/ubuntu/16.10/packages $VESTA/data/packages

# Downloading templates
ADD install/ubuntu/16.10/templates $VESTA/data/templates

ADD install/ubuntu/16.10/templates/web/skel/public_html/index.html /var/www/index.html
RUN sed -i 's/%domain%/It worked!/g' /var/www/index.html

# Downloading firewall rules
ADD install/ubuntu/16.10/firewall $VESTA/data/firewall

# Generating SSL certificate
RUN $VESTA/bin/v-generate-ssl-cert $(hostname) $EMAIL 'US' 'California' \
     'San Francisco' 'Vesta Control Panel' 'IT' > /tmp/vst.pem

# Parsing certificate file
RUN crt_end=$(grep -n "END CERTIFICATE-" /tmp/vst.pem |cut -f 1 -d:) \
 && key_start=$(grep -n "BEGIN RSA" /tmp/vst.pem |cut -f 1 -d:) \
 && key_end=$(grep -n  "END RSA" /tmp/vst.pem |cut -f 1 -d:) \
 && cd $VESTA/ssl \
 && sed -n "1,${crt_end}p" /tmp/vst.pem > certificate.crt \
 && sed -n "$key_start,${key_end}p" /tmp/vst.pem > certificate.key \
 && chown root:mail $VESTA/ssl/* \
 && chmod 660 $VESTA/ssl/* \
 && rm /tmp/vst.pem

# PHP7
RUN mv /usr/local/vesta/data/templates/web/php5-fpm /usr/local/vesta/data/templates/web/php7.0-fpm \
 && mv /usr/local/vesta/data/templates/web/nginx/php5-fpm /usr/local/vesta/data/templates/web/nginx/php7.0-fpm \
 && sed -i "s/php5/php\/7.0/" /usr/local/vesta/func/domain.sh




#----------------------------------------------------------#
#                     Configure Nginx                      #
#----------------------------------------------------------#

RUN rm -f /etc/nginx/conf.d/*.conf
ADD install/ubuntu/16.10/nginx/nginx.conf /etc/nginx/nginx.conf
ADD install/ubuntu/16.10/nginx/status.conf /etc/nginx/conf.d/status.conf
ADD install/ubuntu/16.10/nginx/phpmyadmin.inc /etc/nginx/conf.d/phpmyadmin.inc
ADD install/ubuntu/16.10/nginx/phppgadmin.inc /etc/nginx/conf.d/phppgadmin.inc
ADD install/ubuntu/16.10/nginx/webmail.inc /etc/nginx/conf.d/webmail.inc
ADD install/ubuntu/16.10/logrotate/nginx /etc/logrotate.d/nginx
RUN echo > /etc/nginx/conf.d/vesta.conf \
 && mkdir -p /var/log/nginx/domains


#----------------------------------------------------------#
#                     Configure PHP-FPM                    #
#----------------------------------------------------------#

ADD /install/ubuntu/16.10/php5-fpm/www.conf /etc/php/7.0/fpm/pool.d/www.conf


#----------------------------------------------------------#
#                     Configure PHP                        #
#----------------------------------------------------------#

RUN ZONE=$(timedatectl 2>/dev/null|grep Timezone|awk '{print $2}') \
 && if [ -z "$ZONE" ]; then ZONE='UTC'; fi
 && for pconf in $(find /etc/php* -name php.ini); do sed -i "s/;date.timezone =/date.timezone = $ZONE/g" $pconf; sed -i 's%_open_tag = Off%_open_tag = On%g' $pconf; done



#----------------------------------------------------------#
#                  Configure MySQL/MariaDB                 #
#----------------------------------------------------------#

mycnf="my-small.cnf"

ADD install/ubuntu/16.10/mysql/my-small.cnf /etc/mysql/my.cnf

RUN mysql_install_db \
 && service mysql start \
 && mysqladmin -u root password admin \
 && echo -e "[client]\npassword='admin'\n" > /root/.my.cnf \
 && chmod 600 /root/.my.cnf \
 && mysql -e "DELETE FROM mysql.user WHERE User=''" \
 && mysql -e "DROP DATABASE test" >/dev/null 2>&1 \
 && mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%'" \
 && mysql -e "DELETE FROM mysql.user WHERE user='' or password='';" \
 && mysql -e "FLUSH PRIVILEGES"

# install phpMyAdmin
RUN wget https://github.com/phpmyadmin/phpmyadmin/archive/RELEASE_4_5_5_1.zip -O /tmp/RELEASE_4_5_5_1.zip \
 && unzip /tmp/RELEASE_4_5_5_1.zip -d /tmp/phpmyadmin \
 && mkdir -p /usr/share/phpmyadmin \
 && mv /tmp/phpmyadmin/phpmyadmin-RELEASE_4_5_5_1/* /usr/share/phpmyadmin \
 && rm -rf /tmp/RELEASE_4_4_15_2.zip /tmp/phpmyadmin

# Configuring phpMyAdmin
ADD install/ubuntu/16.10/pma/config.inc.php /usr/share/phpmyadmin/config.inc.php
RUN chmod 777 /var/lib/phpmyadmin/tmp


#----------------------------------------------------------#
#                      Configure Bind                      #
#----------------------------------------------------------#

ADD install/ubuntu/16.10/bind/named.conf /etc/bind/named.conf
RUN sed -i "s%listen-on%//listen%" /etc/bind/named.conf.options \
 && chown root:bind /etc/bind/named.conf \
 && chmod 640 /etc/bind/named.conf \
 && service bind9 start

#----------------------------------------------------------#
#                      Configure Exim                      #
#----------------------------------------------------------#

RUN gpasswd -a Debian-exim mail
ADD install/ubuntu/16.10/exim/exim4.conf.template /etc/exim4/exim4.conf.template
ADD install/ubuntu/16.10/exim/dnsbl.conf /etc/exim4/dnsbl.conf
ADD install/ubuntu/16.10/exim/spam-blocks.conf /etc/exim4/spam-blocks.conf

RUN touch /etc/exim4/white-blocks.conf \
 && chmod 640 /etc/exim4/exim4.conf.template \
 && rm -rf /etc/exim4/domains \
 && mkdir -p /etc/exim4/domains \
 && rm -f /etc/alternatives/mta \
 && ln -s /usr/sbin/exim4 /etc/alternatives/mta \
 && service sendmail stop > /dev/null 2>&1 \
 && service postfix stop > /dev/null 2>&1


#----------------------------------------------------------#
#                     Configure Dovecot                    #
#----------------------------------------------------------#

RUN gpasswd -a dovecot mail \
 && rm -rf /etc/dovecot
ADD install/ubuntu/16.10/dovecot /etc/dovecot
RUN chown -R root:root /etc/dovecot*



#----------------------------------------------------------#
#                   Configure Admin User                   #
#----------------------------------------------------------#

# Adding vesta account
RUN $VESTA/bin/v-add-user admin admin admin@example.com default System Administrator
RUN $VESTA/bin/v-change-user-shell admin bash
RUN $VESTA/bin/v-change-user-language admin en

# Configuring system ips
RUN $VESTA/bin/v-update-sys-ip

# Get main ip
RUN ip=$(ip addr|grep 'inet '|grep global|head -n1|awk '{print $2}'|cut -f1 -d/) \
 && pub_ip=$(wget vestacp.com/what-is-my-ip/ -O - 2>/dev/null) \
 && if [ ! -z "$pub_ip" ] && [ "$pub_ip" != "$ip" ]; then $VESTA/bin/v-change-sys-ip-nat $ip $pub_ip; fi
 && if [ -z "$pub_ip" ]; then ip=$main_ip; fi \

 && if [ "$mysql" = 'yes' ]; then $VESTA/bin/v-add-database-host mysql localhost root admin; $VESTA/bin/v-add-database admin default default $(gen_pass) mysql; fi \

 && if [ "$postgresql" = 'yes' ]; then $VESTA/bin/v-add-database-host pgsql localhost postgres admin; $VESTA/bin/v-add-database admin db db $(gen_pass) pgsql; fi \

 && $VESTA/bin/v-add-domain admin example.com \

 && command='sudo /usr/local/vesta/bin/v-update-sys-queue disk'; $VESTA/bin/v-add-cron-job 'admin' '15' '02' '*' '*' '*' "$command" \
 && command='sudo /usr/local/vesta/bin/v-update-sys-queue traffic'; $VESTA/bin/v-add-cron-job 'admin' '10' '00' '*' '*' '*' "$command" \
 && command='sudo /usr/local/vesta/bin/v-update-sys-queue webstats'; $VESTA/bin/v-add-cron-job 'admin' '30' '03' '*' '*' '*' "$command" \
 && command='sudo /usr/local/vesta/bin/v-update-sys-queue backup'; $VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command" \
 && command='sudo /usr/local/vesta/bin/v-backup-users'; $VESTA/bin/v-add-cron-job 'admin' '10' '05' '*' '*' '*' "$command" \
 && command='sudo /usr/local/vesta/bin/v-update-user-stats'; $VESTA/bin/v-add-cron-job 'admin' '20' '00' '*' '*' '*' "$command" \
 && command='sudo /usr/local/vesta/bin/v-update-sys-rrd'; $VESTA/bin/v-add-cron-job 'admin' '*/5' '*' '*' '*' '*' "$command" \
 
 && $VESTA/bin/v-update-sys-rrd



ADD docker/dovecot /etc/init.d/dovecot
RUN chmod +x /etc/init.d/dovecot

RUN cd /usr/local/vesta/data/ips && mv * 127.0.0.1 \
    && cd /etc/apache2/conf.d && sed -i -- 's/172.*.*.*:80/127.0.0.1:80/g' * && sed -i -- 's/172.*.*.*:8443/127.0.0.1:8443/g' * \
    && cd /etc/nginx/conf.d && sed -i -- 's/172.*.*.*:80;/80;/g' * && sed -i -- 's/172.*.*.*:8080/127.0.0.1:8080/g' * \
    && cd /home/admin/conf/web && sed -i -- 's/172.*.*.*:80;/80;/g' * && sed -i -- 's/172.*.*.*:8080/127.0.0.1:8080/g' *

RUN rm -f /etc/service/sshd/down \
    && /etc/my_init.d/00_regen_ssh_host_keys.sh

RUN mkdir /vesta-start \
    && mkdir /vesta-start/etc \
    && mkdir /vesta-start/var \
    && mkdir /vesta-start/local \
    && mv /home /vesta-start/home \
    && rm -rf /home \
    && ln -s /vesta/home /home \
    && mv /etc/apache2 /vesta-start/etc/apache2 \
    && rm -rf /etc/apache2 \
    && ln -s /vesta/etc/apache2 /etc/apache2 \
    && mv /etc/php5   /vesta-start/etc/php5 \
    && rm -rf /etc/php5 \
    && ln -s /vesta/etc/php5 /etc/php5 \
    && mv /etc/nginx   /vesta-start/etc/nginx \
    && rm -rf /etc/nginx \
    && ln -s /vesta/etc/nginx /etc/nginx \
    && mv /etc/bind    /vesta-start/etc/bind \
    && rm -rf /etc/bind \
    && ln -s /vesta/etc/bind /etc/bind \
    && mv /etc/exim4   /vesta-start/etc/exim4 \
    && rm -rf /etc/exim4 \
    && ln -s /vesta/etc/exim4 /etc/exim4 \
    && mv /etc/dovecot /vesta-start/etc/dovecot \
    && rm -rf /etc/dovecot \
    && ln -s /vesta/etc/dovecot /etc/dovecot \
    && mv /etc/clamav  /vesta-start/etc/clamav \
    && rm -rf /etc/clamav \
    && ln -s /vesta/etc/clamav /etc/clamav \
    && mv /etc/spamassassin    /vesta-start/etc/spamassassin \
    && rm -rf /etc/spamassassin \
    && ln -s /vesta/etc/spamassassin /etc/spamassassin \
    && mv /etc/roundcube   /vesta-start/etc/roundcube \
    && rm -rf /etc/roundcube \
    && ln -s /vesta/etc/roundcube /etc/roundcube \
    && mv /etc/mysql   /vesta-start/etc/mysql \
    && rm -rf /etc/mysql \
    && ln -s /vesta/etc/mysql /etc/mysql \
    && mv /etc/phpmyadmin  /vesta-start/etc/phpmyadmin \
    && rm -rf /etc/phpmyadmin \
    && ln -s /vesta/etc/phpmyadmin /etc/phpmyadmin \
    && mv /root /vesta-start/root \
    && rm -rf /root \
    && ln -s /vesta/root /root \
    && mv /usr/local/vesta /vesta-start/local/vesta \
    && rm -rf /usr/local/vesta \
    && ln -s /vesta/local/vesta /usr/local/vesta \
    && mv /etc/shadow /vesta-start/etc/shadow \
    && rm -rf /etc/shadow \
    && ln -s /vesta/etc/shadow /etc/shadow \
    && mv /etc/bind /vesta-start/etc/bind \
    && rm -rf /etc/bind \
    && ln -s /vesta/etc/bind /etc/bind \
    && mv /etc/profile /vesta-start/etc/profile \
    && rm -rf /etc/profile \
    && ln -s /vesta/etc/profile /etc/profile \
    && mv /var/lib/mysql /vesta-start/var/mysql \
    && rm -rf /var/lib/mysql \
    && ln -s /vesta/var/mysql /var/lib/mysql \
    && mv /var/log /vesta-start/var/log \
    && rm -rf /var/log \
    && ln -s /vesta/var/log /var/log

RUN mkdir -p /vesta-start/local/vesta/data/sessions && chmod 775 /vesta-start/local/vesta/data/sessions && chown root:admin /vesta-start/local/vesta/data/sessions

RUN sed -i "s/upload_max_filesize = 2M/upload_max_filesize = 520M/" /vesta-start/etc/php/7.0/apache2/php.ini && \
    sed -i "s/upload_max_filesize = 2M/upload_max_filesize = 520M/" /vesta-start/etc/php/7.0/cli/php.ini && \
    sed -i "s/post_max_size = 8M/post_max_size = 520M/" /vesta-start/etc/php/7.0/apache2/php.ini && \
    sed -i "s/post_max_size = 8M/post_max_size = 520M/" /vesta-start/etc/php/7.0/cli/php.ini && \
    sed -i "s/max_input_time = 60/max_input_time = 3600/" /vesta-start/etc/php/7.0/apache2/php.ini && \
    sed -i "s/max_execution_time = 30/max_execution_time = 3600/" /vesta-start/etc/php/7.0/apache2/php.ini && \
    sed -i "s/max_input_time = 60/max_input_time = 3600/" /vesta-start/etc/php/7.0/cli/php.ini && \
    sed -i "s/max_execution_time = 30/max_execution_time = 3600/" /vesta-start/etc/php/7.0/cli/php.ini

RUN rm -f /etc/motd && \
    echo "---" > /etc/motd && \
    echo "Support by Made I.T. Contact: tjebbe.lievens@madeit.be" >> /etc/motd && \
    echo "---" >> /etc/motd && \
    touch "/(C) Babim"

RUN dpkg-reconfigure locales && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8 LC_CTYPE=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# clean
RUN apt-get clean && \
    apt-get autoclean && \
    apt-get autoremove -y && \
    rm -rf /build && \
    rm -rf /tmp/* /var/tmp/* && \
    rm -rf /var/lib/apt/lists/* && \
    rm -f /etc/dpkg/dpkg.cfg.d/02apt-speedup

ENV LC_ALL en_US.UTF-8

ENV VESTA /usr/local/vesta
VOLUME /vesta

RUN mkdir -p /etc/my_init.d
ADD docker/startup.sh /etc/my_init.d/startup.sh
RUN chmod +x /etc/my_init.d/startup.sh

EXPOSE 22 80 8083 3306 443 25 993 110 53 54