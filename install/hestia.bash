#!/bin/bash
# Hestia installation wrapper

#
# Currently Supported Operating Systems:
#
#   RHEL 5, 6, 7
#   CentOS 5, 6, 7
#   Debian 7, 8
#   Ubuntu 12.04 LTS - 16.04 LTS
#

# Am I root?
if [ "x$(id -u)" != 'x0' ]; then
    echo 'Error: this script can only be executed by root'
    exit 1
fi

# Check admin user account
if [ ! -z "$(grep ^admin: /etc/passwd)" ] && [ -z "$1" ]; then
    echo "Error: user admin exists"
    echo
    echo 'Please remove admin user account before proceeding.'
    echo 'If you want to do it automatically run installer with -f option:'
    echo "Example: bash $0 --force"
    exit 1
fi

# Check admin group
if [ ! -z "$(grep ^admin: /etc/group)" ] && [ -z "$1" ]; then
    echo "Error: group admin exists"
    echo
    echo 'Please remove admin group before proceeding.'
    echo 'If you want to do it automatically run installer with -f option:'
    echo "Example: bash $0 --force"
    exit 1
fi

# Detect OS
if type lsb_release >/dev/null 2>&1; then
  { read -r name; read -r release; } < <(lsb_release -sir);
elif [[ -e /etc/redhat-release ]]; then
  read -r line < /etc/redhat-release
  regex='^(.*) release (.*) \(.*\)$'
  if [[ $line =~ $regex ]]; then
    name=${BASH_REMATCH[1]} release=${BASH_REMATCH[2]}
  fi
elif [[ -e /etc/os-release ]]; then
  name="notsupported"
else
  name="notsupported"
fi

# check if distro release is supported
if [[ $name == "Red Hat Enterprise Linux" ]]; then
  rhel/install.bash $release
elif [[ $name == "CentOS" ]]; then
  rhel/install.bash $release
elif [[ $name == "Debian" ]]; then
  debian/install.bash $release
elif [[ $name == "Ubuntu" ]]; then
  ubuntu/install.bash $release
else
  echo "Your distribution \"$name $release\" is not supported."
  exit 1
fi

exit
