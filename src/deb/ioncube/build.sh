#!/bin/bash
#
# Builds the vesta-ioncube .deb package by fetching the official ionCube
# Loader tarball and repackaging the .so that matches the PHP ABI version
# pinned in src/deb/versions.env (must stay in sync with vesta-php's PHP
# version -- ionCube loaders are PHP-ABI-specific). ionCube's license
# (clause 2.1, see src/deb/ioncube/copyright) permits free redistribution.
#
# Usage: src/deb/ioncube/build.sh [VERSION] [OUTPUT_SUFFIX]
#   VERSION defaults to 0.0.0+<short git sha> for local/dev builds.
#   CI passes the tag name (without the leading "v").
#   OUTPUT_SUFFIX (e.g. "_noble") picks which OS target's PHP ABI to match
#   (see versions.env) and names the output so bionic/noble builds don't
#   clobber each other, mirroring src/deb/php/build.sh.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
source "$REPO_ROOT/src/deb/versions.env"
VERSION="${1:-0.0.0+$(git -C "$REPO_ROOT" rev-parse --short HEAD)}"
OUTPUT_SUFFIX="${2:-}"

# Empty suffix (bionic) is the only target still capped below the latest
# PHP (see versions.env) -- focal/jammy/noble all share the same ABI/loader.
PHP_VERSION="$PHP_VERSION_BIONIC"
if [ -n "$OUTPUT_SUFFIX" ]; then
    PHP_VERSION="$PHP_VERSION_NOBLE"
fi
PHP_ABI="${PHP_VERSION%.*}"

IONCUBE_URL='https://downloads.ioncube.com/loader_downloads/ioncube_loaders_lin_x86-64.tar.gz'
LOADER_SO="ioncube_loader_lin_${PHP_ABI}.so"

WORKDIR="$(mktemp -d)"
PKGROOT="$(mktemp -d)"
trap 'rm -rf "$WORKDIR" "$PKGROOT"' EXIT

curl -fsSL "$IONCUBE_URL" -o "$WORKDIR/ioncube.tar.gz"
tar -xzf "$WORKDIR/ioncube.tar.gz" -C "$WORKDIR"

if [ ! -f "$WORKDIR/ioncube/$LOADER_SO" ]; then
    echo "Error: $LOADER_SO not found in ionCube download -- PHP ABI $PHP_ABI may not (yet) be supported by ionCube, check versions.env" >&2
    exit 1
fi

mkdir -p "$PKGROOT/usr/local/vesta/ioncube"
cp "$WORKDIR/ioncube/$LOADER_SO" "$PKGROOT/usr/local/vesta/ioncube/"

# Template the RHEL/RPM ioncube.sh (shared across distros) so its hardcoded
# loader filename matches the .so actually shipped in this package.
sed -e "s/ioncube_loader_lin_5\.6\.so/$LOADER_SO/" \
    "$REPO_ROOT/src/rpm/conf/ioncube.sh" > "$PKGROOT/usr/local/vesta/ioncube/ioncube.sh"
chmod 755 "$PKGROOT/usr/local/vesta/ioncube/ioncube.sh"

mkdir -p "$PKGROOT/DEBIAN"
sed -e "s/^Version:.*/Version: $VERSION/" \
    "$REPO_ROOT/src/deb/ioncube/control" > "$PKGROOT/DEBIAN/control"
cp "$REPO_ROOT/src/deb/ioncube/postinst" "$PKGROOT/DEBIAN/postinst"
cp "$REPO_ROOT/src/deb/ioncube/prerm" "$PKGROOT/DEBIAN/prerm"
chmod 755 "$PKGROOT/DEBIAN/postinst" "$PKGROOT/DEBIAN/prerm"
cp "$REPO_ROOT/src/deb/ioncube/conffiles" "$PKGROOT/DEBIAN/conffiles"

dpkg-deb --build --root-owner-group "$PKGROOT" "$REPO_ROOT/vesta-ioncube${OUTPUT_SUFFIX}_amd64.deb"

echo "Built $REPO_ROOT/vesta-ioncube${OUTPUT_SUFFIX}_amd64.deb (version $VERSION, PHP ABI $PHP_ABI)"
