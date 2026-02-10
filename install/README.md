# Vesta Control Panel - Modern Installation Scripts

## Supported Operating Systems

| OS | Version | Status | Notes |
|----|---------|--------|-------|
| Ubuntu | 24.04 (Noble) | ✅ Tested | Fully working |
| Ubuntu | 22.04 (Jammy) | ✅ Tested | Fully working, out-of-the-box |
| Ubuntu | 20.04 (Focal) | ⚠️ Untested on ARM64 | Should work on x86_64 servers |
| Debian | 12 (Bookworm) | ⚠️ Not tested | ARM64 test environment limitation |
| Debian | 11 (Bullseye) | ⚠️ Not tested | ARM64 test environment limitation |
| Debian | 10 (Buster) | ⚠️ Not tested | ARM64 test environment limitation |
| RHEL/Rocky | 8/9 | ⚠️ Not tested | Separate installer available |

## Test Results (Ubuntu 22.04)

Installation tested on Ubuntu 22.04 (ARM64 via Multipass). All tests passed:

| Component | Status | Details |
|-----------|--------|---------|
| Panel accessible | ✅ Pass | HTTP 200 on port 8083 |
| Admin login | ✅ Pass | Authentication works correctly |
| Statistics display | ✅ Pass | U_USERS, U_WEB_DOMAINS, etc. showing |
| Webmail URL | ✅ Pass | Relative path `/webmail/` |
| phpMyAdmin URL | ✅ Pass | Relative path `/phpmyadmin/` |
| phpMyAdmin service | ✅ Pass | HTTP 200 |
| Roundcube webmail | ✅ Pass | HTTP 200 |

**No manual intervention required** - installer works out-of-the-box.

## Testing Notes

Testing was performed on Apple Silicon (ARM64) using Multipass VMs. The ondrej PHP PPA does not provide PHP 8.3 ARM64 packages for Ubuntu 20.04, which caused installation to fail in the test environment. This is not expected to be an issue on x86_64 production servers where the PPA has full support.

Debian could not be tested as Multipass only supports Ubuntu images. Docker was not used to avoid ARM64 emulation issues.

## Installation

### Ubuntu (20.04, 22.04, 24.04)
```bash
curl -fsSL https://raw.githubusercontent.com/Dennis-SEG/vesta/beta/2.0-modern/install/vst-install-ubuntu-modern.sh | sudo bash
```

### Debian (10, 11, 12)
```bash
curl -fsSL https://raw.githubusercontent.com/Dennis-SEG/vesta/beta/2.0-modern/install/vst-install-debian-modern.sh | sudo bash
```

### RHEL/Rocky Linux (8, 9)
```bash
curl -fsSL https://raw.githubusercontent.com/Dennis-SEG/vesta/beta/2.0-modern/install/vst-install-rhel-modern.sh | sudo bash
```

## Features

- PHP 8.3 support (from ondrej PPA)
- MariaDB 10.11+
- Nginx + Apache (reverse proxy setup)
- Modern React-based control panel
- Roundcube webmail integration
- phpMyAdmin integration
- Let's Encrypt SSL support

## Recent Fixes

- **Statistics display**: Fixed variable initialization order in login API
- **Webmail/phpMyAdmin URLs**: Changed to relative paths for correct proxying
- **Admin user config**: All required fields now included (U_*, SUSPENDED_*, etc.)
- **Password hashing**: Using SHA-512 for Vesta compatibility
- **React app loading**: Fixed static/index.html to match root index.html

## Known Issues

- ARM64 (Apple Silicon): PHP 8.3 packages may not be available for older Ubuntu versions
- Debian installers not yet tested on x86_64 servers
