#!/bin/bash

export TERM=xterm

PATH=$PATH:/usr/local/vesta/bin
export PATH

#starting Vesta
cd /etc/init.d/ \
&& ./vesta start \
&& ./mysqld start \
&& ./bind start \
&& ./nginx start \
&& ./exim4 start \
&& ./httpd start \
&& ./dovecot start