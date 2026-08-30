# System Requirements and Software Versions

This document details the current status of system dependencies and recommended versions for Vesta Control Panel.

## Current Status

⚠️ **IMPORTANT**: The installation scripts currently reference outdated software versions. This document outlines what needs to be updated for modern production use.

## Operating Systems

### Currently Supported (in code)
- Ubuntu 12.04 - 18.10 (directories exist)
- Debian 7, 8
- RHEL/CentOS 5, 6, 7
- Amazon Linux 2017

### **NEEDS UPDATE** - Should Support (2025)
- ✅ **Ubuntu 20.04 LTS** (Focal) - Supported until April 2025
- ✅ **Ubuntu 22.04 LTS** (Jammy) - Supported until April 2027
- ✅ **Ubuntu 24.04 LTS** (Noble) - Supported until April 2029
- ✅ **Debian 10** (Buster) - Supported until June 2024
- ✅ **Debian 11** (Bullseye) - Supported until June 2026
- ✅ **Debian 12** (Bookworm) - Supported until June 2028
- ✅ **RHEL/Rocky Linux/AlmaLinux 8** - Supported until May 2029
- ✅ **RHEL/Rocky Linux/AlmaLinux 9** - Supported until May 2032

### Should Drop Support
- ❌ Ubuntu 12.04 - 18.10 (All End of Life)
- ❌ Debian 7, 8 (End of Life)
- ❌ RHEL/CentOS 5, 6 (End of Life)
- ❌ Amazon Linux 2017 (End of Life)

## PHP

### Current Status in Code
- Scripts reference **PHP 5.x** (End of Life since 2019)
- Scripts reference **PHP 7.0** (End of Life since December 2018)
- RHEL script has **PHP 8.1** support (good but needs update)

### **CRITICAL UPDATE NEEDED**
- ❌ **PHP 5.x** - REMOVE (End of Life, major security risks)
- ❌ **PHP 7.0-7.4** - REMOVE (All End of Life)
- ⚠️ **PHP 8.0** - End of Life (November 2023)
- ⚠️ **PHP 8.1** - Security support until November 2024, should upgrade
- ✅ **PHP 8.2** - Supported until December 2025
- ✅ **PHP 8.3** - **RECOMMENDED** - Supported until December 2026
- ✅ **PHP 8.4** - Latest stable (November 2024) - Supported until November 2027

### Recommendation
- **Minimum supported**: PHP 8.1
- **Recommended**: PHP 8.3
- **Support**: PHP 8.2, 8.3, 8.4

## Database Servers

### MySQL
Current: Unspecified version from distribution repos

**NEEDS UPDATE**:
- ❌ MySQL 5.5, 5.6, 5.7 - End of Life
- ✅ **MySQL 8.0** - Latest stable (8.0.40 as of Jan 2025)
- ✅ **MySQL 8.4 LTS** - Long-term support release
- ✅ **MySQL 9.0** - Innovation release

**Recommendation**: MySQL 8.0 (LTS) or 8.4 (newer LTS)

### MariaDB
Current: Unspecified version from distribution repos

**NEEDS UPDATE**:
- ❌ MariaDB 5.5, 10.0, 10.1, 10.2, 10.3, 10.4 - End of Life
- ⚠️ MariaDB 10.5 - Maintenance until June 2025
- ✅ **MariaDB 10.6 LTS** - Supported until July 2026
- ✅ **MariaDB 10.11 LTS** - Supported until February 2028
- ✅ **MariaDB 11.4 LTS** - Latest LTS, supported until May 2029

**Recommendation**: MariaDB 10.11 LTS or 11.4 LTS

### PostgreSQL
Current: Unspecified version from distribution repos

**NEEDS UPDATE**:
- ❌ PostgreSQL 9.x, 10.x, 11.x - End of Life
- ⚠️ PostgreSQL 12 - End of Life November 2024
- ⚠️ PostgreSQL 13 - Supported until November 2025
- ✅ **PostgreSQL 14** - Supported until November 2026
- ✅ **PostgreSQL 15** - Supported until November 2027
- ✅ **PostgreSQL 16** - Supported until November 2028
- ✅ **PostgreSQL 17** - Latest (September 2024), supported until November 2029

**Recommendation**: PostgreSQL 16 or 17

## Web Servers

### Nginx
Current: Unspecified version from distribution repos

**NEEDS UPDATE**:
- ✅ **Nginx 1.26.x** - Stable branch
- ✅ **Nginx 1.27.x** - Mainline branch (latest features)

**Recommendation**: Nginx 1.26.x (stable) from official Nginx repos

### Apache
Current: From distribution repos (apache2, apache2.2-common references)

**NEEDS UPDATE**:
- ❌ Apache 2.2 - End of Life (2017)
- ✅ **Apache 2.4** - Current stable (2.4.62 as of Jan 2025)

**Recommendation**: Apache 2.4.x from distribution repos

## Mail Servers

### Exim
Current: exim4, exim4-daemon-heavy from distribution repos

**Status**: Distribution versions are acceptable
- ✅ Exim 4.x is current and maintained

### Dovecot
Current: dovecot-imapd, dovecot-pop3d from distribution repos

**Status**: Distribution versions are acceptable
- ✅ Dovecot 2.3.x is current and maintained

## phpMyAdmin

Current: Installed from distribution repos without version specification

**NEEDS UPDATE**:
- ❌ phpMyAdmin 4.x - Old, should update
- ✅ **phpMyAdmin 5.2.x** - Latest stable (5.2.1 as of Jan 2025)

**Recommendation**: Install phpMyAdmin 5.2.x
- Requires PHP 7.2+ (compatible with PHP 8.x)
- Download from official source or use Composer

## phpPgAdmin

Current: Installed from distribution repos

**ISSUE**: phpPgAdmin is largely unmaintained

**Recommendation**: Replace with **Adminer** or **pgAdmin 4**
- **Adminer** - Modern, single-file, supports PostgreSQL and MySQL
- **pgAdmin 4** - Official PostgreSQL administration tool

## Other Components

### Node.js (for development)
- ✅ **Node.js 18 LTS** - Supported until April 2025
- ✅ **Node.js 20 LTS** - **RECOMMENDED** - Supported until April 2026
- ✅ **Node.js 22 LTS** - Latest LTS, supported until April 2027

### Let's Encrypt (Certbot)
- ✅ Use latest certbot from official repos
- ✅ Ensure ACME v2 protocol support

### Fail2ban
- ✅ 0.11.x or 1.0.x from distribution repos

### ClamAV
- ✅ Latest from distribution repos
- Regular database updates essential

### SpamAssassin
- ✅ 3.4.x or 4.x from distribution repos

## Priority Action Items

### Critical (Security Risk)
1. **Remove PHP 5.x support completely**
2. **Remove PHP 7.0-7.4 support**
3. **Add PHP 8.2, 8.3, 8.4 support**
4. **Drop EOL operating systems (Ubuntu < 20.04, Debian < 10, RHEL/CentOS < 8)**

### High Priority
5. **Add Ubuntu 20.04, 22.04, 24.04 support**
6. **Add Debian 11, 12 support**
7. **Add RHEL 8, 9 / Rocky Linux / AlmaLinux support**
8. **Update MySQL to 8.0+ or MariaDB to 10.11+**
9. **Update phpMyAdmin to 5.2.x**

### Medium Priority
10. **Update PostgreSQL to 16+**
11. **Specify Nginx version (1.26.x stable)**
12. **Replace phpPgAdmin with modern alternative**
13. **Update documentation with supported versions**

### Low Priority
14. **Add PHP 8.4 support**
15. **Test with MySQL 8.4 LTS**
16. **Test with MariaDB 11.4 LTS**

## Installation Script Updates Needed

### Files to Update:
1. `install/vst-install-ubuntu.sh`
   - Remove Ubuntu < 20.04
   - Add Ubuntu 20.04, 22.04, 24.04
   - Update PHP versions
   - Add PHP 8.x repository configuration

2. `install/vst-install-debian.sh`
   - Remove Debian < 10
   - Add Debian 10, 11, 12
   - Update PHP versions
   - Update PHP-FPM configuration paths

3. `install/vst-install-rhel.sh`
   - Add RHEL/Rocky/AlmaLinux 8, 9
   - Update to remi-php83 or php84
   - Update MariaDB/MySQL configuration

4. `install/vst-install-amazon.sh`
   - Update for Amazon Linux 2023
   - Update PHP versions

5. Create new OS-specific directories:
   - `install/ubuntu/20.04/`
   - `install/ubuntu/22.04/`
   - `install/ubuntu/24.04/`
   - `install/debian/11/`
   - `install/debian/12/`
   - `install/rhel/8/`
   - `install/rhel/9/`

## Testing Matrix

After updates, test on:
- ✅ Ubuntu 22.04 LTS + PHP 8.3 + MariaDB 10.11
- ✅ Ubuntu 24.04 LTS + PHP 8.3 + MySQL 8.0
- ✅ Debian 12 + PHP 8.2 + PostgreSQL 16
- ✅ Rocky Linux 9 + PHP 8.3 + MariaDB 10.11

## Migration Notes for Existing Installations

### From PHP 7.x to PHP 8.x
- Test all hosted applications for PHP 8 compatibility
- Update deprecated functions
- Check error_reporting settings
- Test mail functionality

### From MySQL 5.7 to 8.0
- Check authentication plugin (mysql_native_password vs caching_sha2_password)
- Review SQL mode changes
- Test application compatibility

### From old OS to new OS
- Full backup before migration
- Test in staging environment
- Plan downtime window
- Have rollback plan

## References

- PHP Support: https://www.php.net/supported-versions.php
- MySQL Releases: https://dev.mysql.com/doc/relnotes/mysql/8.0/en/
- MariaDB Releases: https://mariadb.org/about/
- PostgreSQL Support: https://www.postgresql.org/support/versioning/
- Ubuntu Releases: https://wiki.ubuntu.com/Releases
- Debian Releases: https://wiki.debian.org/DebianReleases
- RHEL Lifecycle: https://access.redhat.com/support/policy/updates/errata

---

**Last Updated**: 2025-01-07
**Status**: ⚠️ CRITICAL UPDATES REQUIRED
**Next Review**: 2025-04-01
