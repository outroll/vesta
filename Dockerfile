FROM ubuntu:latest

RUN apt-get update -y --fix-missing
RUN apt-get install -y wget lsb-release
RUN wget http://vestacp.com/pub/vst-install-ubuntu.sh -O vst-install-ubuntu.sh \
 && bash vst-install-ubuntu.sh --nginx yes --apache yes --phpfpm no --named yes --remi yes --vsftpd no --proftpd no --iptables no --fail2ban no --quota no --exim yes --dovecot yes --spamassassin no --clamav no --mysql yes --postgresql no --hostname example.com --email test@example.com --password admin -y no --force


EXPOSE 22 80 8083 3306 443 25 993 110 53 54