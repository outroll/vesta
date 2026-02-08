# Ubuntu 22.04 LTS Installation Guide

This document describes the installation files and setup procedures for Vesta Control Panel on Ubuntu 22.04 LTS.

## Install Files Structure

```
install/ubuntu/22.04/
├── packages/           # Default hosting packages
│   ├── default.pkg
│   ├── low.pkg
│   ├── medium.pkg
│   ├── high.pkg
│   └── unlimited.pkg
├── templates/          # Web and DNS templates
│   ├── web/
│   │   ├── apache2/
│   │   ├── nginx/
│   │   └── php-fpm/
│   └── dns/
├── phpmyadmin/         # phpMyAdmin setup
│   ├── setup.sh
│   └── nginx.conf
└── roundcube/          # Roundcube webmail setup
    ├── setup.sh
    ├── apache.conf
    └── nginx.conf
```

## Packages

Default hosting packages with resource limits:

| Package | Web Domains | Databases | Email | Disk | Bandwidth |
|---------|-------------|-----------|-------|------|-----------|
| default | 10 | 10 | 10 | 10GB | 100GB |
| low | 5 | 5 | 5 | 5GB | 50GB |
| medium | 20 | 20 | 20 | 20GB | 200GB |
| high | 50 | 50 | 50 | 50GB | 500GB |
| unlimited | ∞ | ∞ | ∞ | ∞ | ∞ |

## phpMyAdmin Setup

### Installation

```bash
sudo /usr/local/vesta/install/ubuntu/22.04/phpmyadmin/setup.sh
```

### What it does

1. Installs phpMyAdmin package
2. Creates MySQL user `phpmyadmin` with random password
3. Imports phpMyAdmin database tables
4. Configures Apache for phpMyAdmin
5. Sets up nginx reverse proxy on port 8084 (HTTPS)
6. Opens firewall port 8084
7. Adds `DB_PMA_URL` to vesta.conf

### Access

- URL: `https://your-server:8084/`
- Login with any MySQL user credentials

### Nginx Proxy Configuration

The nginx proxy (`/etc/nginx/conf.d/phpmyadmin.conf`):
- Listens on port 8084 with SSL
- Proxies to Apache on localhost:8080
- Handles cookie paths and redirects

## Roundcube Webmail Setup

### Installation

```bash
sudo /usr/local/vesta/install/ubuntu/22.04/roundcube/setup.sh
```

### What it does

1. Preseeds debconf for non-interactive install
2. Installs Roundcube and MySQL driver
3. Creates MySQL user `roundcube` with random password
4. Imports Roundcube database schema
5. Configures Apache with webmail aliases
6. Sets up nginx proxy on port 80 for `/webmail`
7. Adds `MAIL_URL` to vesta.conf

### Access

- URL: `http://your-server/webmail/`
- Login with email account credentials

### Configuration Files

- Apache: `/etc/apache2/conf-available/roundcube.conf`
- Nginx: `/etc/nginx/conf.d/webmail.conf`
- Roundcube DB: `/etc/roundcube/debian-db.php`

## MariaDB Service Detection

Ubuntu 22.04 uses MariaDB instead of MySQL. The `v-list-sys-services` script has been updated to detect MariaDB properly:

- Checks for `/lib/systemd/system/mariadb.service`
- Uses `mariadbd` as the process name
- Shows correct running status in the control panel

## PHP Versions

Ubuntu 22.04 supports PHP 8.0 - 8.4 via the Sury PPA. Templates are provided for:

- php-fpm-80
- php-fpm-81
- php-fpm-82
- php-fpm-83
- php-fpm-84

## Quick Test Setup (Development)

For developers who want to test the web UI without running the full installer:

```bash
cd /path/to/vesta
sudo ./install/test-setup.sh
```

This script:
- Installs nginx and PHP-FPM
- Copies Vesta files to `/usr/local/vesta/`
- Configures sudoers for www-data
- Sets up nginx on port 8083

Access the UI at `http://your-ip:8083`

**Note:** This is for testing only. For production, use the full installer.

## Troubleshooting

### phpMyAdmin shows cookie error

Ensure nginx proxy headers are set correctly:
```nginx
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-Port 8084;
proxy_cookie_path /phpmyadmin /;
```

### MySQL shows as stopped in panel

The MariaDB service detection fix is in `bin/v-list-sys-services`. Ensure you have the updated version.

### Webmail link goes to wrong URL

The React UI fix ensures external links use `<a>` tags instead of React Router `Link` components. Rebuild the React app if needed.
