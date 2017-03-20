#!/bin/bash

export TERM=xterm

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
PATH=$PATH:/usr/local/vesta/bin
=======
PATH=$PATH:'$VESTA'/bin'
>>>>>>> 2f0bf7e... Dockerfile
=======
PATH=$PATH:$VESTA/bin
>>>>>>> e87c2a9... Dockerfile
=======
PATH=$PATH:/usr/local/vesta/bin
>>>>>>> 8565a1b... Dockerfile
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