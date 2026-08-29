#!/bin/bash
# Vesta installation wrapper
# https://github.com/outroll/vesta
#
# Detects the running distribution and hands over to the matching installer
# next to this script. Run the per-distro script directly if you want to pick
# one yourself.
#
# Currently Supported Operating Systems:
#
#   RHEL / CentOS / Rocky / AlmaLinux
#   Debian
#   Ubuntu 12.04 - 18.10, 20.04, 22.04, 24.04
#   Alpine
#   Amazon Linux 2017
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

# Detect OS
if [ -f /etc/os-release ]; then
    # Subshell -- os-release sets VERSION/NAME which we do not want to inherit.
    os="$(. /etc/os-release && echo "$ID")"
    id_like="$(. /etc/os-release && echo "$ID_LIKE")"
    release="$(. /etc/os-release && echo "$VERSION_ID")"
else
    # Pre-os-release systems (Ubuntu 12.04, RHEL 5/6) still ship /etc/issue.
    case $(head -n1 /etc/issue | cut -f 1 -d ' ') in
        Debian)     os="debian" ;;
        Ubuntu)     os="ubuntu" ;;
        Amazon)     os="amzn" ;;
        *)          os="rhel" ;;
    esac
    id_like=""
    release=""
fi

case "$os" in
    ubuntu)                             type="ubuntu" ;;
    debian)                             type="debian" ;;
    alpine)                             type="alpine" ;;
    amzn)                               type="amazon" ;;
    rhel|centos|rocky|almalinux|fedora) type="rhel" ;;
    *)
        # Unknown ID -- fall back to the family it declares.
        case " $id_like " in
            *" rhel "*|*" fedora "*) type="rhel" ;;
            *" debian "*)            type="debian" ;;
            *)
                echo "Error: unsupported operating system: $os $release"
                echo 'Supported: Ubuntu, Debian, RHEL/CentOS/Rocky/AlmaLinux, Alpine, Amazon Linux'
                exit 1
                ;;
        esac
        ;;
esac

echo "Detected: ${os:-unknown} ${release}"

installer="vst-install-$type.sh"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Prefer the installer shipped alongside this script (git checkout), otherwise
# download it -- keeps `curl https://vestacp.com/pub/vst-install.sh | bash`
# working the way it always has.
if [ -f "$script_dir/$installer" ]; then
    echo "Using local installer: $installer"
    bash "$script_dir/$installer" "$@"
    exit
fi

if [ ! -e '/usr/bin/wget' ]; then
    echo "Error: wget is not installed"
    echo 'Please install wget and run this script again:'
    case "$type" in
        rhel)   echo 'yum -y install wget' ;;
        alpine) echo 'apk add wget' ;;
        *)      echo 'apt-get -y install wget' ;;
    esac
    exit 1
fi

wget "http://vestacp.com/pub/$installer" -O "$installer"
if [ "$?" -ne '0' ]; then
    echo "Error: $installer download failed."
    exit 1
fi
bash "$installer" "$@"
