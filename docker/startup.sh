#!/bin/bash

export TERM=xterm

PATH=$PATH:/usr/local/vesta/bin
export PATH

#starting Vesta
cd /etc/init.d/ \
&& ./vesta start \
&& ./mysql start \
&& ./bind9 start \
&& ./nginx start \
&& ./exim4 start \
&& ./apache2 start \
&& ./dovecot start