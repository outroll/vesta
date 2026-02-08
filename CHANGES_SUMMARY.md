# Changes Summary

This document summarizes all changes made in the PHP 8 / React 18 modernization effort.

## Quick Stats

- **Files Changed:** 481
- **Lines Added:** 40,427
- **Lines Removed:** 13,850
- **Tested On:** Ubuntu 22.04 LTS VM

## PHP Modernization

### Compatibility Fixes

- ✅ All 327 PHP files tested with PHP 8.0 - 8.4
- ✅ Replaced `error_reporting(NULL)` with `error_reporting(0)` in 136 files
- ✅ Fixed stray semicolon bug in `web/api/v1/edit/server/index.php:108`
- ✅ No deprecated functions (`create_function()`, `each()`, `mysql_*`)

### Security

- ✅ All CSRF tokens in place
- ✅ `escapeshellarg()` used for shell commands
- ✅ Input validation on all forms

## React UI Modernization

### Upgrades

| Package | Old Version | New Version |
|---------|-------------|-------------|
| React | 16.x | 18.3.1 |
| React Router | 5.x | 6.28.0 |
| Bootstrap | 4.x | 5.3.3 |
| Redux | 4.x | 5.0.1 |
| axios | 0.x | 1.7.9 |
| dayjs | - | 1.11.13 |

### API Authentication Fixes

Added missing `getAuthToken()` to:
- Package.js
- RRD.js
- Statistics.js
- Logs.js
- WebLogs.js
- Favorites.js
- UserNS.js
- Backup.js (6 functions)

### External Link Fixes

Changed from React Router `Link` to `<a>` tags:
- phpMyAdmin link in Databases.jsx
- phpPgAdmin link in Databases.jsx
- Webmail link in Mails.jsx

### Accessibility

- Fixed Modal `aria-hidden` to be dynamic
- Fixed `tabindex` → `tabIndex` (React camelCase)

## Ubuntu 22.04 Install Files

### New Directories

```
install/ubuntu/22.04/
├── packages/        # 5 hosting packages
├── templates/       # Web + DNS templates
├── phpmyadmin/      # Setup script + nginx config
└── roundcube/       # Setup script + configs
```

### phpMyAdmin Setup

- Installs via apt
- Creates MySQL user with random password
- Nginx proxy on port 8084 (HTTPS)
- Firewall port opened

### Roundcube Setup

- Preseed for non-interactive install
- Creates MySQL user and database
- Apache + Nginx configuration
- Accessible at /webmail/

## Shell Script Fixes

### MariaDB Service Detection

Fixed `bin/v-list-sys-services` to detect MariaDB on Ubuntu:

```bash
# Now checks for MariaDB on any system
if [ -e "/lib/systemd/system/mariadb.service" ] || \
   [ -e "/usr/lib/systemd/system/mariadb.service" ]; then
    service='mariadb'
    proc_name='mariadbd'
fi
```

## CI/CD Workflows

### New Workflows

| Workflow | Purpose |
|----------|---------|
| ci.yml | Tests PHP + React across versions |
| build-packages.yml | Builds .deb packages |
| release.yml | Creates GitHub releases |
| dependency-update.yml | Weekly update checks |

### Test Matrix

- Node.js: 18, 20, 22
- PHP: 8.0, 8.1, 8.2, 8.3, 8.4
- Ubuntu: 22.04, 24.04
- Debian: 11, 12

## Documentation Added

| File | Description |
|------|-------------|
| UBUNTU_22.04_INSTALL.md | Install guide for Ubuntu 22.04 |
| REACT_API_FIXES.md | React/API fixes documentation |
| CI_CD_WORKFLOWS.md | CI/CD pipeline documentation |
| CHANGES_SUMMARY.md | This file |

## Commits

Key commits in this PR:

1. PHP 8 compatibility fixes
2. React 18 migration
3. Bootstrap 5 migration
4. Add missing auth tokens to API service calls
5. Fix phpMyAdmin/phpPgAdmin links
6. Add Ubuntu 22.04 install files and phpMyAdmin setup
7. Fix Backup API auth tokens, Modal accessibility, webmail link
8. Add Roundcube webmail setup for Ubuntu 22.04
9. Fix MariaDB service detection on Ubuntu/Debian

## Testing Performed

All tested on Ubuntu 22.04 VM via Multipass:

- ✅ Control panel UI loads
- ✅ User management
- ✅ Package management
- ✅ Domain management
- ✅ Database management
- ✅ phpMyAdmin access
- ✅ Mail management
- ✅ Roundcube webmail access
- ✅ Backup functionality
- ✅ Statistics and graphs
- ✅ Web logs viewer
- ✅ Server status (MariaDB shows running)
