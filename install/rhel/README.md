# RHEL/Rocky/AlmaLinux Configuration Templates

This directory contains OS-specific configuration templates for RHEL-compatible distributions.

## Supported Distributions

- **RHEL 8** - Supported until May 2029
- **RHEL 9** - Supported until May 2032
- **Rocky Linux 8** - Community supported
- **Rocky Linux 9** - Community supported
- **AlmaLinux 8** - Community supported
- **AlmaLinux 9** - Community supported

## Directory Structure

Each version directory contains configuration templates for all Vesta services.

## PHP Versions

PHP support via Remi repository:

- **RHEL/Rocky/Alma 8**: PHP 8.2, 8.3, 8.4 via Remi
- **RHEL/Rocky/Alma 9**: PHP 8.2, 8.3, 8.4 via Remi

Default: PHP 8.3 (recommended for all versions)

## Database Versions

- **RHEL/Rocky/Alma 8**: MariaDB 10.3 (appstream) or 10.11+ (MariaDB repo)
- **RHEL/Rocky/Alma 9**: MariaDB 10.5 (appstream) or 10.11+ (MariaDB repo)

## Package Naming

Note: RHEL uses different package names than Debian/Ubuntu:
- Apache: `httpd` (not `apache2`)
- PHP-FPM: `php-fpm` (not `php8.3-fpm`)
- Mail: May use Postfix instead of Exim

## Usage

```bash
bash vst-install-rhel.sh --php 8.3
```

The installer auto-detects Rocky Linux and AlmaLinux as RHEL-compatible.

## Status

⚠️ **IN DEVELOPMENT**

## Legacy Versions

RHEL/CentOS 5, 6, 7 are **NOT SUPPORTED** (End of Life).
