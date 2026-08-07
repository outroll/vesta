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
# bookworm keeps libcurl4/libssl3/libzip4 untransitioned; trixie renamed
# libcurl4->libcurl4t64, libssl1.1->libssl3t64 (time_t64 transition) and
# separately bumped libzip's soname 4->5 (unrelated to that transition).
DEPENDS='vesta, libonig4, libcurl4, libssl1.1, libxml2, libzip4, libsqlite3-0'
if [ "$OUTPUT_SUFFIX" = '_noble' ]; then
    DEPENDS='vesta, libonig5, libcurl4t64, libssl3t64, libxml2, libzip4t64, libsqlite3-0'
elif [ "$OUTPUT_SUFFIX" = '_bookworm' ]; then
    DEPENDS='vesta, libonig5, libcurl4, libssl3, libxml2, libzip4, libsqlite3-0'
elif [ "$OUTPUT_SUFFIX" = '_trixie' ]; then
    DEPENDS='vesta, libonig5, libcurl4t64, libssl3t64, libxml2, libzip5, libsqlite3-0'
fi

# --with-external-libcrypt: bionic's PHP keeps its own bundled crypt()
# implementation (bionic predates yescrypt, so its /etc/shadow hashes are
# still md5/sha-512-crypt, which the bundled implementation already covers,
# and bionic doesn't have a libcrypt-dev package to build against anyway).
# noble/bookworm/trixie all default new /etc/shadow entries to yescrypt
# ($y$) -- PHP's bundled crypt() doesn't implement that algorithm at all
# (crypt() just returns the "*0" failure sentinel for it), so the admin
# panel's own login (web/api/v1/login/index.php, via bin/v-get-user-salt +
# bin/v-check-user-hash) can never succeed there without linking against
# the system's real libxcrypt instead. Verified: with this flag, crypt()
# output exactly matches chpasswd's /etc/shadow yescrypt hash for the same
# password+salt.
EXTERNAL_LIBCRYPT_FLAG=""
if [ -n "$OUTPUT_SUFFIX" ]; then
    EXTERNAL_LIBCRYPT_FLAG="--with-external-libcrypt"
fi

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
        --with-pdo-mysql \
        $EXTERNAL_LIBCRYPT_FLAG
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
