#!/bin/bash

# *** Debian only ***

wget -O - http://apt.myvestacp.com/deb_signing.key | sudo apt-key add -
codename="$(cat /etc/os-release |grep VERSION= |cut -f 2 -d \(|cut -f 1 -d \))"
echo "deb http://apt.myvestacp.com/$codename/ $codename vesta" > /etc/apt/sources.list.d/vesta.list
apt update
apt install -y vesta vesta-php vesta-nginx

service vesta stop
service vesta start
