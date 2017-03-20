#!/bin/bash

export TERM=xterm

#starting Vesta
cd /etc/init.d/ \
&& ./vesta start \
&& ./mysql start \
&& ./bind9 start \
&& ./nginx start \
&& ./exim4 start \
&& ./apache2 start \
&& ./dovecot start