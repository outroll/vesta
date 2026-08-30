# Ubuntu Configuration Templates

This directory contains OS-specific configuration templates for Ubuntu LTS releases.

## Supported Versions

- **20.04 LTS (Focal Fossa)** - Supported until April 2025
- **22.04 LTS (Jammy Jellyfish)** - Supported until April 2027
- **24.04 LTS (Noble Numbat)** - Supported until April 2029

## Directory Structure

Each version directory contains configuration templates for:

- `nginx/` - Nginx web server configurations
- `apache2/` - Apache web server configurations
- `php/` - PHP-FPM and PHP configuration files
- `mysql/` - MySQL/MariaDB configuration templates
- `postgresql/` - PostgreSQL configuration templates
- `exim4/` - Exim mail server configurations
- `dovecot/` - Dovecot IMAP/POP3 configurations
- `bind/` - BIND DNS server configurations
- `vsftpd/` - Vsftpd FTP server configurations
- `proftpd/` - ProFTPD server configurations
- `fail2ban/` - Fail2ban security configurations
- `phpmyadmin/` - phpMyAdmin web interface configurations

## PHP Versions

Ubuntu version-specific PHP support:

- **Ubuntu 20.04**: PHP 8.2, 8.3 via ondrej PPA
- **Ubuntu 22.04**: PHP 8.2, 8.3, 8.4 via ondrej PPA
- **Ubuntu 24.04**: PHP 8.2, 8.3, 8.4 via ondrej PPA

Default: PHP 8.3 (recommended for all versions)

## Database Versions

- **Ubuntu 20.04**: MariaDB 10.3 (repo) or 10.11+ (MariaDB repo)
- **Ubuntu 22.04**: MariaDB 10.6 (repo) or 10.11+ (MariaDB repo)
- **Ubuntu 24.04**: MariaDB 10.11 (repo)

Alternatively, MySQL 8.0+ can be installed from MySQL official repository.

## Usage

These templates are used by the Vesta installer script:
```bash
bash vst-install-ubuntu.sh --php 8.3
```

The installer automatically selects the correct template based on the detected Ubuntu version.

## Status

⚠️ **IN DEVELOPMENT**

Configuration templates are being migrated from older Ubuntu versions and updated for:
- PHP 8.x compatibility
- Modern security standards
- Current best practices

## Contributing

When adding or updating templates:
1. Test on fresh OS installation
2. Follow security best practices
3. Document any version-specific changes
4. Maintain compatibility with Vesta panel

## Legacy Versions

Ubuntu versions older than 20.04 are **NOT SUPPORTED** due to:
- End of Life status
- Security vulnerabilities
- Outdated PHP/software versions

Legacy configurations remain in numbered directories (12.04, 14.04, etc.) for reference only.
