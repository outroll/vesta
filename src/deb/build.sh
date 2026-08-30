#!/bin/bash
#
# Builds the vesta .deb package from the current checkout of this repo.
# Used both by the release-vesta-deb GitHub Actions workflow and for ad-hoc
# local builds on a Debian/Ubuntu test host (needs dpkg-deb, so it won't run
# on macOS directly -- build it inside the test VM).
#
# Usage: src/deb/build.sh [VERSION]
#   VERSION defaults to 0.0.0+<short git sha> for local/dev builds.
#   CI passes the tag name (without the leading "v").

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VERSION="${1:-0.0.0+$(git -C "$REPO_ROOT" rev-parse --short HEAD)}"

PKGROOT="$(mktemp -d)"
trap 'rm -rf "$PKGROOT"' EXIT

mkdir -p "$PKGROOT/usr/local/vesta"
rsync -a --exclude='.git' --exclude='.github' "$REPO_ROOT"/ "$PKGROOT/usr/local/vesta/"

mkdir -p "$PKGROOT/DEBIAN"
sed -e "s/^Version:.*/Version: $VERSION/" \
    "$REPO_ROOT/src/deb/vesta/control" > "$PKGROOT/DEBIAN/control"
cp "$REPO_ROOT/src/deb/vesta/postinst" "$PKGROOT/DEBIAN/postinst"
chmod 755 "$PKGROOT/DEBIAN/postinst"
cp "$REPO_ROOT/src/deb/vesta/conffiles" "$PKGROOT/DEBIAN/conffiles"

# -Zxz because dpkg on the build host defaults to zstd, which Debian's
# dpkg cannot read before 1.21 -- a zstd .deb fails to unpack on
# bullseye with "dpkg-deb --control subprocess returned error exit
# status 2". xz is understood by every release these installers target.
dpkg-deb -Zxz --build --root-owner-group "$PKGROOT" "$REPO_ROOT/vesta_amd64.deb"

echo "Built $REPO_ROOT/vesta_amd64.deb (version $VERSION)"
