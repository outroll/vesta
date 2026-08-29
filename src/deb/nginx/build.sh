#!/bin/bash
#
# Builds the vesta-nginx .deb package by compiling nginx from source with
# the same flags used by src/rpm/specs/vesta-nginx.spec. This is a
# dedicated nginx used only for the Vesta admin panel UI (port 8083) --
# separate from the site-facing nginx installed from nginx.org's own repo.
#
# Requires build deps: build-essential libpcre3-dev zlib1g-dev libssl-dev
# (see .github/workflows/release-vesta-deb.yml for the CI install step).
#
# Usage: src/deb/nginx/build.sh [VERSION] [OUTPUT_SUFFIX]
#   VERSION defaults to 0.0.0+<short git sha> for local/dev builds.
#   CI passes the tag name (without the leading "v").
#   OUTPUT_SUFFIX (e.g. "_noble") names a per-OS build so releases don't clobber each other.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
source "$REPO_ROOT/src/deb/versions.env"
VERSION="${1:-0.0.0+$(git -C "$REPO_ROOT" rev-parse --short HEAD)}"
OUTPUT_SUFFIX="${2:-}"

# Depends: is for bionic's runtime libs; 24.04 renamed libssl1.1 -> libssl3t64.
DEPENDS='vesta, libpcre3, zlib1g, libssl1.1'
if [ "$OUTPUT_SUFFIX" = '_noble' ]; then
    DEPENDS='vesta, libpcre3, zlib1g, libssl3t64'
fi

NGINX_URL="https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz"

WORKDIR="$(mktemp -d)"
PKGROOT="$(mktemp -d)"
trap 'rm -rf "$WORKDIR" "$PKGROOT"' EXIT

curl -fsSL "$NGINX_URL" -o "$WORKDIR/nginx.tar.gz"
tar -xzf "$WORKDIR/nginx.tar.gz" -C "$WORKDIR"

(
    cd "$WORKDIR/nginx-${NGINX_VERSION}"
    ./configure --prefix=/usr/local/vesta/nginx --with-http_ssl_module
    make -j"$(nproc)"
    make install DESTDIR="$PKGROOT"
)

# Vesta-specific admin panel vhost (listens on 8083, proxies *.php to
# vesta-php's fastcgi socket) replaces the stock nginx.conf.
cp "$REPO_ROOT/src/rpm/conf/nginx.conf" "$PKGROOT/usr/local/vesta/nginx/conf/nginx.conf"

# The init script (src/deb/nginx/vesta) hardcodes this binary name.
cp "$PKGROOT/usr/local/vesta/nginx/sbin/nginx" "$PKGROOT/usr/local/vesta/nginx/sbin/vesta-nginx"

mkdir -p "$PKGROOT/DEBIAN"
sed -e "s/^Version:.*/Version: $VERSION/" \
    -e "s/^Depends:.*/Depends: $DEPENDS/" \
    "$REPO_ROOT/src/deb/nginx/control" > "$PKGROOT/DEBIAN/control"
cp "$REPO_ROOT/src/deb/nginx/postinst" "$PKGROOT/DEBIAN/postinst"
cp "$REPO_ROOT/src/deb/nginx/postrm" "$PKGROOT/DEBIAN/postrm"
chmod 755 "$PKGROOT/DEBIAN/postinst" "$PKGROOT/DEBIAN/postrm"
cp "$REPO_ROOT/src/deb/nginx/conffiles" "$PKGROOT/DEBIAN/conffiles"

mkdir -p "$PKGROOT/etc/init.d"
cp "$REPO_ROOT/src/deb/nginx/vesta" "$PKGROOT/etc/init.d/vesta"
chmod 755 "$PKGROOT/etc/init.d/vesta"

dpkg-deb --build --root-owner-group "$PKGROOT" "$REPO_ROOT/vesta-nginx${OUTPUT_SUFFIX}_amd64.deb"

echo "Built $REPO_ROOT/vesta-nginx${OUTPUT_SUFFIX}_amd64.deb (nginx $NGINX_VERSION, package version $VERSION)"
