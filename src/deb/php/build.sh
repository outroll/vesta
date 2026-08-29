#!/bin/bash
#
# Builds the vesta-php .deb package by compiling php-fpm from source. This
# is a dedicated php-fpm used only for the Vesta admin panel's own PHP
# codebase (web/*.php) -- separate from site-hosting PHP, which comes from
# distro php-fpm packages.
#
# Configure flags are NOT a straight port of src/rpm/specs/vesta-php.spec:
# that spec's `--with-mysql` flag targets the ext/mysql extension, which
# was removed in PHP 7.0. This uses --with-mysqli/--with-pdo-mysql instead,
# re-derived against the PHP 8.2 ./configure --help surface.
#
# Requires build deps: build-essential libxml2-dev libssl-dev
# libcurl4-openssl-dev zlib1g-dev libonig-dev libzip-dev libsqlite3-dev
# pkg-config bison re2c autoconf (see .github/workflows/release-vesta-deb.yml).
#
# Usage: src/deb/php/build.sh [VERSION] [OUTPUT_SUFFIX]
#   VERSION defaults to 0.0.0+<short git sha> for local/dev builds.
#   CI passes the tag name (without the leading "v").
#   OUTPUT_SUFFIX (e.g. "_noble") names a per-OS build so releases don't clobber each other.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
source "$REPO_ROOT/src/deb/versions.env"
VERSION="${1:-0.0.0+$(git -C "$REPO_ROOT" rev-parse --short HEAD)}"
OUTPUT_SUFFIX="${2:-}"

# Depends: is for bionic's runtime libs; libsqlite3-0 was missing (PHP auto-links it).
# Every later release renamed or dropped at least one of these, so each one
# that the installer supports gets its own build with its own Depends:.
DEPENDS='vesta, libonig4, libcurl4, libssl1.1, libxml2, libzip4, libsqlite3-0'
case "$OUTPUT_SUFFIX" in
    # focal keeps libssl1.1/libcurl4 but moved to libonig5 and libzip5.
    _focal) DEPENDS='vesta, libonig5, libcurl4, libssl1.1, libxml2, libzip5, libsqlite3-0' ;;
    # jammy dropped libssl1.1 for libssl3 and went back to libzip4.
    _jammy) DEPENDS='vesta, libonig5, libcurl4, libssl3, libxml2, libzip4, libsqlite3-0' ;;
    # noble renamed the time_t-64 ABI packages with a t64 suffix.
    _noble) DEPENDS='vesta, libonig5, libcurl4t64, libssl3t64, libxml2, libzip4t64, libsqlite3-0' ;;
esac

PHP_URL="https://www.php.net/distributions/php-${PHP_VERSION}.tar.gz"

WORKDIR="$(mktemp -d)"
PKGROOT="$(mktemp -d)"
trap 'rm -rf "$WORKDIR" "$PKGROOT"' EXIT

curl -fsSL "$PHP_URL" -o "$WORKDIR/php.tar.gz"
tar -xzf "$WORKDIR/php.tar.gz" -C "$WORKDIR"

(
    cd "$WORKDIR/php-${PHP_VERSION}"
    ./configure \
        --prefix=/usr/local/vesta/php \
        --enable-fpm \
        --with-fpm-user=admin \
        --with-fpm-group=admin \
        --enable-mbstring \
        --with-curl \
        --with-zlib \
        --with-openssl \
        --enable-zip \
        --with-mysqli \
        --with-pdo-mysql
    make -j"$(nproc)"
    make install INSTALL_ROOT="$PKGROOT"
)

cp "$REPO_ROOT/src/rpm/conf/php.ini" "$PKGROOT/usr/local/vesta/php/lib/php.ini"
mkdir -p "$PKGROOT/usr/local/vesta/php/etc"
cp "$REPO_ROOT/src/rpm/conf/php-fpm.conf" "$PKGROOT/usr/local/vesta/php/etc/php-fpm.conf"

# The init script (src/deb/nginx/vesta) hardcodes this binary name.
cp "$PKGROOT/usr/local/vesta/php/sbin/php-fpm" "$PKGROOT/usr/local/vesta/php/sbin/vesta-php"

mkdir -p "$PKGROOT/DEBIAN"
sed -e "s/^Version:.*/Version: $VERSION/" \
    -e "s/^Depends:.*/Depends: $DEPENDS/" \
    "$REPO_ROOT/src/deb/php/control" > "$PKGROOT/DEBIAN/control"
cp "$REPO_ROOT/src/deb/php/postinst" "$PKGROOT/DEBIAN/postinst"
chmod 755 "$PKGROOT/DEBIAN/postinst"

dpkg-deb --build --root-owner-group "$PKGROOT" "$REPO_ROOT/vesta-php${OUTPUT_SUFFIX}_amd64.deb"

echo "Built $REPO_ROOT/vesta-php${OUTPUT_SUFFIX}_amd64.deb (php $PHP_VERSION, package version $VERSION)"
