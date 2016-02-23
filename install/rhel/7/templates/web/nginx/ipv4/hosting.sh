#!/bin/bash
# Changing public_html permission
user="$1"
domain="$2"
ip="$3"
ipv6="$4"
home_dir="$5"
docroot="$6"

chmod 755 $docroot

exit 0
