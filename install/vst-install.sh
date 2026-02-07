#!/bin/bash
# Vesta installation wrapper v2.0
# https://github.com/Dennis-SEG/vesta
#
# Supported Operating Systems:
#   Ubuntu 20.04, 22.04, 24.04 LTS
#   Debian 10, 11, 12
#   RHEL/Rocky/Alma 8, 9
#

set -e

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

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Detect OS and version
if [ -f /etc/os-release ]; then
    . /etc/os-release
    os=$ID
    version=$VERSION_ID
else
    echo "Error: Cannot detect operating system"
    exit 1
fi

echo "Detected: $os $version"

# Select appropriate installer
case $os in
    ubuntu)
        case $version in
            20.04|22.04|24.04)
                installer="vst-install-ubuntu-modern.sh"
                ;;
            *)
                installer="vst-install-ubuntu.sh"
                ;;
        esac
        ;;
    debian)
        case $version in
            10|11|12)
                installer="vst-install-debian-modern.sh"
                ;;
            *)
                installer="vst-install-debian.sh"
                ;;
        esac
        ;;
    rhel|centos|rocky|almalinux)
        case ${version%%.*} in
            8|9)
                installer="vst-install-rhel-modern.sh"
                ;;
            *)
                installer="vst-install-rhel.sh"
                ;;
        esac
        ;;
    amzn)
        installer="vst-install-amazon.sh"
        ;;
    *)
        echo "Error: Unsupported operating system: $os"
        echo "Supported: Ubuntu 20.04+, Debian 10+, RHEL/Rocky/Alma 8+"
        exit 1
        ;;
esac

# Check if installer exists locally
if [ -f "$SCRIPT_DIR/$installer" ]; then
    echo "Using local installer: $installer"
    bash "$SCRIPT_DIR/$installer" "$@"
else
    echo "Error: Installer not found: $SCRIPT_DIR/$installer"
    exit 1
fi
