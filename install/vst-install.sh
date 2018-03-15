#!/bin/bash
# Vesta installation wrapper
# http://vestacp.com

#
# Style guides
# https://google.github.io/styleguide/shell.xml
# https://github.com/icy/bash-coding-style
#

#
# Currently Supported Operating Systems:
#
#   RHEL 5, 6, 7
#   CentOS 5, 6, 7
#   Debian 7, 8, 9
#   Ubuntu LTS 12.04, 14.04, 16.04
#


#----------------------------------------------------------#
#                  Check system privileges                 #
#----------------------------------------------------------#

# Am I root?
if [ "x$(id -u)" != 'x0' ]; then
  echo "Error: this script can only be executed by root";
  exit 1;
fi;

# Check admin user account
if [ ! -z "$(grep ^admin: /etc/passwd)" ] && [ -z "$1" ]; then
  echo "Error: user admin exists";
  echo;
  echo "Please remove admin user before proceeding.";
  echo "If you want to do it automatically run installer with -f option:";
  echo "Example: bash $0 --force";
  exit 1;
fi;

# Check admin group
if [ ! -z "$(grep ^admin: /etc/group)" ] && [ -z "$1" ]; then
  echo "Error: group admin exists";
  echo;
  echo "Please remove admin group before proceeding.";
  echo "If you want to do it automatically run installer with -f option:";
  echo "Example: bash $0 --force";
  exit 1;
fi;


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


#----------------------------------------------------------#
#               Install minimum requirements               #
#----------------------------------------------------------#

# Debian and Ubuntu \
if [ "$os" == "debian" ] || [ "$os" == "ubuntu" ]; then \
  printf "Installing minimum requirements...\n" && \
  \
  printf "Disable installation of optional apt packages...\n" && \
  printf "\n# Disable recommended and suggested packages\n\
APT::Install-Recommends "\""false"\"";\n\
APT::Install-Suggests "\""false"\"";\n\
\n" >> /etc/apt/apt.conf && \
  \
  # Fix Debian repository configuration \
  if [ "$os" == "debian" ]; then \
    mkdir -p /var/cache/yum/{base,extras,updates,centosplus};
  printf "Enable contrib and non-free components in debian repositories...\n" && \
  sed -i "s>main>main contrib non-free>" /etc/apt/sources.list; \
  fi && \
  \
  printf "Refresh the package manager...\n" && \
  apt-get update && \
  \
  printf "Install the package manager packages...\n" && \
  apt-get install -qy \
    apt-utils apt-transport-https && \
  \
  printf "Install the selected packages...\n" && \
  apt-get install -qy \
    dialog debianutils sed grep wget curl \
    gnupg gpgv dirmngr openssl ca-certificates && \
  \
  printf "Finished installing minimum requirements...\n"; \
  \
# CentOS and RHEL \
elif [ "$os" == "centos" ] || [ "$os" == "rhel" ]; then \
  # Fix CentOS 5 repository configuration \
  if [ "$os" == "centos" ] && [ "$release" == "5" ]; then \
    mkdir -p /var/cache/yum/{base,extras,updates,centosplus} && \
    echo "http://vault.centos.org/5.11/os/x86_64/" > /var/cache/yum/base/mirrorlist.txt && \
    echo "http://vault.centos.org/5.11/extras/x86_64/" > /var/cache/yum/extras/mirrorlist.txt && \
    echo "http://vault.centos.org/5.11/updates/x86_64/" > /var/cache/yum/updates/mirrorlist.txt && \
    echo "http://vault.centos.org/5.11/centosplus/86_64/" > /var/cache/yum/centosplus/mirrorlist.txt && \
    sed -i '/\libselinux\]/,/^ *\[/ s/enabled=1/enabled=0/' /etc/yum.repos.d/libselinux.repo; \
  fi && \
  \
  printf "Installing minimum requirements...\n" && \
  \
  printf "Refresh the package manager...\n" && \
  rpm --rebuilddb && yum makecache && \
  \
  printf "Install the package manager packages...\n" && \
  if [ "$os" == "centos" ] && [ "$release" != "5" ]; then \
    yum install -y \
      yum-plugin-fastestmirror yum-plugin-priorities \
      yum-plugin-keys yum-utils; \
  elif [ "$os" == "centos" ] && [ "$release" == "5" ]; then \
    yum install -y \
      yum-utils; \
  fi && \
  \
  printf "Install the selected packages...\n" && \
  if [ "$os" == "centos" ] && [ "$release" != "5" ]; then \
    yum install -y \
      dialog which sed grep wget curl \
      gnupg openssl ca-certificates; \
  elif [ "$os" == "centos" ] && [ "$release" == "5" ]; then \
    yum downgrade -y libselinux && \
    yum install -y \
      dialog which sed grep wget curl \
      gnupg openssl; \
  fi && \
  \
  # Fix CentOS 5 certificates \
  #if [ "$os" == "centos" ] && [ "$release" == "5" ]; then \
  #  wget --no-check-certificate --secure-protocol=TLSv1 http://curl.haxx.se/ca/cacert.pem -O /etc/pki/tls/certs/ca-bundle.crt; \
  #fi && \
  \
  printf "Finished installing minimum requirements...\n"; \
fi;


#----------------------------------------------------------#
#                     Execute installer                    #
#----------------------------------------------------------#

# Donwload installer if it does not exist or is not readable \
if [ ! -r "vst-install-$type.sh" ]; then \
  # Look for wget \
  if [ -e "/usr/bin/wget" ]; then \
    wget http://vestacp.com/pub/vst-install-$type.sh -O vst-install-$type.sh; \
  # Look for curl \
  elif [ -e "/usr/bin/curl" ]; then \
    curl -O http://vestacp.com/pub/vst-install-$type.sh; \
  else \
    echo "Error: Could not find wget or curl to download installer."; \
  fi; \
fi;

# Check if installer exists and is readable \
if [ -r "vst-install-$type.sh" ]; then \
  chmod +x vst-install-$type.sh && \
  source vst-install-$type.sh; \
else \
  echo "Error: vst-install-$type.sh download failed." && \
  exit 1; \
fi;

exit;
