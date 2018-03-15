#!/bin/bash
# Vesta installation wrapper
# http://vestacp.com

#
# Currently Supported Operating Systems:
#
#   RHEL 5, 6, 7
#   CentOS 5, 6, 7
#   Debian 7, 8
#   Ubuntu 12.04 - 16.10
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
    echo 'Please remove admin user before proceeding.'
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


#----------------------------------------------------------#
#                 Check system information                 #
#----------------------------------------------------------#

# Lookup /etc/os-release file on systemd and newer distros
if [ -r "/etc/os-release" ]; then
  source  /etc/os-release;
  os=$ID;
  release=$(echo $VERSION_ID | cut -d . -f 1);
  # Get codename from variable or from other sources
  if [ -n "$VERSION_CODENAME" ]; then
    codename=$VERSION_CODENAME;
  else
    case $os in
      debian)
        codename=$(awk -F"[)(]+" '/VERSION=/ {print $2}' /etc/os-release);
        ;;
      ubuntu)
        codename=$(echo "${VERSION/*, /}" | awk '{print $1}' | tr '[:upper:]' '[:lower:]');
        ;;
      centos|rhel)
        codename="${os}$release";
        ;;
    esac;
  fi;

# Lookup lsb_release binary on newer distros
elif [ type lsb_release >/dev/null 2>&1 ]; then
  os=$(lsb_release -si);
  release=$(lsb_release -sr | cut -d . -f 1);
  codename=$(lsb_release -sc);

# Lookup /etc/lsb-release file on Ubuntu based distros
elif [ -r "/etc/lsb-release" ]; then
  source  /etc/lsb-release;
  os=$($DISTRIB_ID | tr '[:upper:]' '[:lower:]');
  release=$(echo $DISTRIB_RELEASE | cut -d . -f 1);
  codename=$($DISTRIB_CODENAME | tr '[:upper:]' '[:lower:]');

# Lookup /etc/system-release file on newer Red Hat based distros
elif [ -r "/etc/system-release" ]; then
  os=$(cut -f 1 -d ' ' /etc/system-release | tr '[:upper:]' '[:lower:]');
  release=$(grep -o "[0-9]" /etc/system-release | head -n 1);
  codename="${os}$release";

# Lookup /etc/redhat-release file on older Red Hat based distros
elif [ -r "/etc/redhat-release" ]; then
  os=$(cut -f 1 -d ' ' /etc/redhat-release | tr '[:upper:]' '[:lower:]');
  release=$(grep -o "[0-9]" /etc/redhat-release | head -n 1);
  codename="${os}$release";

# Unknown system
else
  echo "Error: could not detect system or distribution";
  exit 1;
fi;

# Validate distribution, release codename and set type
printf "\nDetected distribution ${os} ${release} (${codename})\n";
case $os in
    debian)
      type="debian";
      supported_releases=("7 8 9");
      supported_codenames=("wheezy jessie stretch");
      ;;

    ubuntu)
      type="ubuntu";
      supported_releases=("12 14 16");
      supported_codenames=("precise trusty xenial");
      ;;

    centos)
      type="centos";
      supported_releases=("5 6 7");
      supported_codenames=("centos5 centos6 centos7");
      ;;

    centos)
      type="rhel";
      supported_releases=("5 6 7");
      supported_codenames=("rhel5 rhel6 rhel7");
      ;;

    *)
      printf "\nUnsupported distribution\n";
      exit 1;
      ;;
esac;
if [[ ! " ${supported_releases[@]} " =~ " ${release} " ]]; then
  printf "\nUnsupported distribution release\n";
  exit 1;
fi;
if [[ ! " ${supported_codenames[@]} " =~ " ${codename} " ]]; then
  printf "\nUnsupported distribution codename\n";
  exit 1;
fi;


# Check wget
if [ -e '/usr/bin/wget' ]; then
    wget http://vestacp.com/pub/vst-install-$type.sh -O vst-install-$type.sh
    if [ "$?" -eq '0' ]; then
        bash vst-install-$type.sh $*
        exit
    else
        echo "Error: vst-install-$type.sh download failed."
        exit 1
    fi
fi

# Check curl
if [ -e '/usr/bin/curl' ]; then
    curl -O http://vestacp.com/pub/vst-install-$type.sh
    if [ "$?" -eq '0' ]; then
        bash vst-install-$type.sh $*
        exit
    else
        echo "Error: vst-install-$type.sh download failed."
        exit 1
    fi
fi

exit
