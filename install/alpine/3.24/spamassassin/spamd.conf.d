# spamd listens on 127.0.0.1:783 by default -- exim.conf's
# "spamd_address = 127.0.0.1 783" (install/alpine/3.24/exim/exim.conf)
# depends on that default, so don't add --socketpath here.
command_args="-m 5 -c -H -A 127.0.0.1"
