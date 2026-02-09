# Vesta Control Panel - Modern Installation Scripts

## Supported Operating Systems

| OS | Version | Status | Notes |
|----|---------|--------|-------|
| Ubuntu | 24.04 (Noble) | ✅ Tested | Fully working |
| Ubuntu | 22.04 (Jammy) | ✅ Tested | Fully working |
| Ubuntu | 20.04 (Focal) | ⚠️ Untested on ARM64 | Should work on x86_64 servers |
| Debian | 12 (Bookworm) | ⚠️ Not tested | ARM64 test environment limitation |
| Debian | 11 (Bullseye) | ⚠️ Not tested | ARM64 test environment limitation |
| Debian | 10 (Buster) | ⚠️ Not tested | ARM64 test environment limitation |
| RHEL/Rocky | 8/9 | ⚠️ Not tested | Separate installer available |

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

## Known Issues

- ARM64 (Apple Silicon): PHP 8.3 packages may not be available for older Ubuntu versions
- Debian installers not yet tested on x86_64 servers
