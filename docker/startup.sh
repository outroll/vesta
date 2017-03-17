#!/bin/bash

export TERM=xterm

#starting Vesta
cd /etc/init.d/ \
&& ./vesta start \
&& ./mysql start \
&& ./nginx start \
&& ./exim4 start \
&& ./php7.0-fpm start \
&& ./dovecot start