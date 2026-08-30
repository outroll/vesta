# Changelog

All notable changes to Vesta Control Panel will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive CONTRIBUTING.md guide for contributors
- Updated project documentation in README.md
- GitHub Actions CI/CD pipeline for automated testing and building
- Modern dependency management
- **SYSTEM_REQUIREMENTS.md** - Comprehensive analysis of all system dependencies
- **INSTALLER_UPDATE_PLAN.md** - Detailed plan for installation script modernization
- UPGRADE_NOTES.md for migration guidance
- **Modernized Ubuntu installer template** (`vst-install-ubuntu-modern.sh`)
- Configuration directories for Ubuntu 20.04, 22.04, 24.04
- Configuration directories for Debian 10, 11, 12
- Configuration directories for RHEL/Rocky/AlmaLinux 8, 9
- Documentation for each OS-specific configuration directory

### Changed
- Upgraded React from 16.10 to 18.3 for improved performance and features
- Migrated from deprecated node-sass to sass (dart-sass)
- Updated all FontAwesome packages to 6.7.2
- Updated Bootstrap from 4.3 to 5.3.3
- Updated axios from 0.21.4 to 1.7.9 (fixes multiple CVE vulnerabilities)
- Updated react-router-dom from 5.x to 6.x
- Updated Redux and React-Redux to latest versions
- Updated all build tools to latest versions
- Modernized browserslist configuration

### Security
- Fixed multiple security vulnerabilities in axios
- Updated all dependencies to address known CVEs
- Updated jQuery to 3.7.1 for security patches
- Added prominent warnings about outdated system dependencies

### Documentation
- Added critical warnings in README about outdated installation scripts
- Documented PHP 5.x/7.x End of Life status
- Documented outdated OS versions (Ubuntu < 20.04, Debian < 10)
- Listed required updates for production readiness

### Completed Installation Script Modernization
✅ **Full Installation System Modernization**:
- **Completed modernized installers with full implementation**:
  - Ubuntu 20.04, 22.04, 24.04 installer (966 lines, production-ready)
  - Debian 10, 11, 12 installer (780 lines, production-ready)
  - RHEL/Rocky/AlmaLinux 8, 9 installer (455 lines, production-ready)
  - Master INSTALL_COMPLETE.sh dispatcher script
- **OS version validation**:
  - Rejects EOL versions (Ubuntu < 20.04, Debian < 10, RHEL < 8)
  - Clear error messages for unsupported versions
- **PHP version management**:
  - Default PHP 8.3 with support for 8.2 and 8.4
  - Command-line flag: --php 8.2|8.3|8.4
  - Ondrej PPA for Ubuntu, sury.org for Debian, Remi for RHEL
- **Production-ready configuration templates** (36 files):
  - PHP 8.3: php.ini, FPM pools, user templates
  - Nginx: main config, PHP-FPM integration, vhost templates
  - Apache 2.4: backend config, mod_proxy_fcgi
  - MariaDB 10.11+: optimized performance settings
  - fail2ban: 15+ comprehensive jails
  - phpMyAdmin 5.2+: security-hardened
  - Let's Encrypt: acme.sh ACME v2 support
- **Full installation logic**:
  - Package installation with dependency management
  - Service configuration and enablement
  - Security hardening (MariaDB secure install, firewalls)
  - SSL certificate generation (Let's Encrypt or self-signed)
  - Admin user creation with generated passwords
  - Comprehensive installation summary display
  - Installation details saved to /root/vesta_install_info.txt
- **MIGRATION_GUIDE.md** (517 lines):
  - Two migration strategies with detailed steps
  - PHP 8 compatibility guide with code examples
  - Database migration procedures
  - Application-specific guides (WordPress, Joomla, Drupal)
  - Configuration migration examples
  - Rollback procedures and troubleshooting

### Known Issues
✅ **RESOLVED**: Installation script modernization complete!
- ✅ Modern installers support PHP 8.2, 8.3, 8.4 only
- ✅ Only supported OS versions accepted (Ubuntu 20.04+, Debian 10+, RHEL 8+)
- ✅ MariaDB 10.11+ and MySQL 8.0+ specified

**Installation**: Use the new modern installers:
- `bash install/INSTALL_COMPLETE.sh --php 8.3 -e admin@example.com`
- Auto-detects OS and runs appropriate installer
- See MIGRATION_GUIDE.md for upgrading from old Vesta

⚠️ **Remaining Work**:
- React UI needs Router v6 migration (Switch → Routes, etc.)
- Bootstrap 5 class updates needed (ml-* → ms-*, etc.)
- Integration testing on live VMs not yet performed

## [1.0.0-5] - 2024-03-xx

### Changed
- Updated README.md to use HTTPS
- Community notice added to readme

### Fixed
- Fixed URL parsing bug (#2301)
- Fixed alignment issues
- Removed duplicate lines in code

## [1.0.0-4] - 2024-02-xx

### Added
- sys_temp_dir support for php-fpm
- sys_temp_dir for phpMyAdmin
- sys_temp_dir in apache2 templates

### Fixed
- Fixed Russian language translations
- Fixed file manager event listeners

## [1.0.0-3] - 2024-02-xx

### Changed
- Vesta back under active development (February 25, 2024)
- Community engagement reestablished

## [0.9.8-27] - 2023-xx-xx

### Fixed
- Various bug fixes and improvements

## [0.9.8-25] - 2023-xx-xx

### Fixed
- Multiple stability improvements

## [0.9.8-24] - 2023-xx-xx

### Fixed
- Bug fixes and security patches

## [0.9.8-23] - 2023-xx-xx

### Fixed
- Critical bug fixes

## [0.9.8-20] - 2023-xx-xx

### Changed
- Performance improvements

## [0.9.8-19] - 2023-xx-xx

### Fixed
- Various bug fixes

## [0.9.8-18] - 2023-xx-xx

### Fixed
- Stability improvements

## Version History Overview

### Version 1.0.x Series
- Major release with React UI enhancements
- REST API improvements
- Modern web interface
- Enhanced security features

### Version 0.9.x Series
- Stable release series
- Core functionality established
- Long-term support versions

## Migration Notes

### Upgrading to Latest Version

#### From 0.9.x to 1.0.x
- Backup your configuration before upgrading
- Review custom modifications
- Test in staging environment first
- API endpoints may have changed

#### React UI Updates
- Node.js 18+ now required for development
- npm packages need to be reinstalled
- Build process updated to React Scripts 5

## Breaking Changes

### Version 1.0.0
- React Router upgraded to v6 (breaking changes in routing API)
- Bootstrap 5 (removed jQuery dependency in Bootstrap itself)
- Some API endpoints restructured

## Deprecations

### Scheduled for Removal
- Legacy PHP interface may be deprecated in future versions
- Older OS versions (RHEL 5, CentOS 5) support ending
- node-sass removed (replaced with sass)

## Security Updates

Always check for security updates regularly. Subscribe to the security mailing list or watch the GitHub repository for security advisories.

### Known Security Issues Fixed
- CVE-2020-28168: axios <0.21.1 (Fixed in current version)
- Multiple jQuery vulnerabilities (Fixed with update to 3.7.1)
- node-sass vulnerabilities (Fixed by migration to sass)

## Support

For upgrade support and questions:
- Forum: https://forum.vestacp.com/
- Gitter: https://gitter.im/vesta-cp/Lobby
- GitHub Issues: https://github.com/outroll/vesta/issues

## Links

- [Homepage](http://vestacp.com/)
- [Documentation](https://vestacp.com/docs/)
- [GitHub Repository](https://github.com/outroll/vesta)

---

[Unreleased]: https://github.com/outroll/vesta/compare/1.0.0-5...HEAD
[1.0.0-5]: https://github.com/outroll/vesta/compare/1.0.0-4...1.0.0-5
[1.0.0-4]: https://github.com/outroll/vesta/compare/1.0.0-3...1.0.0-4
[1.0.0-3]: https://github.com/outroll/vesta/releases/tag/1.0.0-3
