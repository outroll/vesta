# Debian Configuration Templates

This directory contains OS-specific configuration templates for supported Debian releases.

## Supported Versions

- **10 (Buster)** - Supported until June 2024 (extended support until 2026)
- **11 (Bullseye)** - Supported until June 2026
- **12 (Bookworm)** - Supported until June 2028

## Directory Structure

Each version directory contains configuration templates for all Vesta services.

## PHP Versions

Debian version-specific PHP support:

- **Debian 10**: PHP 8.2, 8.3 via sury.org repository
- **Debian 11**: PHP 8.2, 8.3, 8.4 via sury.org repository
- **Debian 12**: PHP 8.2, 8.3, 8.4 via sury.org repository

Default: PHP 8.3 (recommended for all versions)

## Database Versions

- **Debian 10**: MariaDB 10.3 (repo) or 10.11+ (MariaDB repo)
- **Debian 11**: MariaDB 10.5 (repo) or 10.11+ (MariaDB repo)
- **Debian 12**: MariaDB 10.11 (repo)

## Usage

```bash
bash vst-install-debian.sh --php 8.3
```

## Status

⚠️ **IN DEVELOPMENT**

## Legacy Versions

Debian 7 and 8 are **NOT SUPPORTED** (End of Life).
