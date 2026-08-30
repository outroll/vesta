# Vesta Control Panel - Testing Guide

**Version:** 2.0.0 (Modernized)
**Last Updated:** January 2025

## Overview

This document provides comprehensive testing procedures for Vesta Control Panel modernized installers. Use these tests to verify installation success and functionality.

## Table of Contents

- [Pre-Installation Testing](#pre-installation-testing)
- [Installation Testing](#installation-testing)
- [Post-Installation Testing](#post-installation-testing)
- [Service Testing](#service-testing)
- [Security Testing](#security-testing)
- [Functional Testing](#functional-testing)
- [Performance Testing](#performance-testing)
- [Automated Testing](#automated-testing)

---

## Pre-Installation Testing

### Test Environment Setup

**Recommended Test Environments:**

1. **Ubuntu Testing**
   - Ubuntu 20.04 LTS (fresh VM)
   - Ubuntu 22.04 LTS (fresh VM)
   - Ubuntu 24.04 LTS (fresh VM)

2. **Debian Testing**
   - Debian 10 (Buster) (fresh VM)
   - Debian 11 (Bullseye) (fresh VM)
   - Debian 12 (Bookworm) (fresh VM)

3. **RHEL Family Testing**
   - Rocky Linux 8 (fresh VM)
   - Rocky Linux 9 (fresh VM)
   - AlmaLinux 8 (fresh VM)
   - AlmaLinux 9 (fresh VM)

**VM Specifications:**
- **Minimum:** 2 CPU cores, 4GB RAM, 40GB disk
- **Recommended:** 4 CPU cores, 8GB RAM, 80GB disk
- **Network:** Public IP or NAT with port forwarding

### Pre-Installation Checklist

- [ ] Fresh OS installation (no existing web servers)
- [ ] Root access confirmed
- [ ] Internet connectivity verified
- [ ] Sufficient disk space (minimum 20GB free)
- [ ] DNS configured (if testing hostname/SSL)
- [ ] Backup/snapshot created (for rollback testing)

---

## Installation Testing

### Test Case 1: Basic Installation

**Objective:** Verify basic installation with default settings

**Steps:**
```bash
# Download installer
wget https://github.com/outroll/vesta/raw/master/install/INSTALL_COMPLETE.sh

# Run basic installation
bash INSTALL_COMPLETE.sh -e test@example.com
```

**Expected Results:**
- [ ] Installer detects OS correctly
- [ ] All packages install without errors
- [ ] PHP 8.3 installed as default
- [ ] MariaDB installed and secured
- [ ] Admin password generated and displayed
- [ ] Installation completes in 10-20 minutes
- [ ] `/root/vesta_install_info.txt` created
- [ ] Control panel accessible at `https://IP:8083`

**Exit Criteria:** Installation completes successfully with "INSTALLATION COMPLETE!" message

### Test Case 2: Installation with PHP Version Selection

**Objective:** Test PHP version parameter

**Tests:**

**Test 2a: PHP 8.2**
```bash
bash INSTALL_COMPLETE.sh --php 8.2 -e test@example.com
```
- [ ] PHP 8.2 installed
- [ ] Verify: `php -v` shows 8.2.x

**Test 2b: PHP 8.3** (default)
```bash
bash INSTALL_COMPLETE.sh --php 8.3 -e test@example.com
```
- [ ] PHP 8.3 installed
- [ ] Verify: `php -v` shows 8.3.x

**Test 2c: PHP 8.4**
```bash
bash INSTALL_COMPLETE.sh --php 8.4 -e test@example.com
```
- [ ] PHP 8.4 installed
- [ ] Verify: `php -v` shows 8.4.x

### Test Case 3: Installation with Custom Parameters

**Objective:** Test all installation parameters

```bash
bash INSTALL_COMPLETE.sh \
  --php 8.3 \
  -e admin@testdomain.com \
  -p TestPassword123 \
  -s vesta.testdomain.com \
  --ssl yes
```

**Expected Results:**
- [ ] Custom email saved in admin config
- [ ] Custom password works for login
- [ ] Hostname set correctly
- [ ] Let's Encrypt SSL attempted (may fail without valid DNS)

### Test Case 4: EOL Version Rejection

**Objective:** Verify installer rejects unsupported OS versions

**Ubuntu:**
- [ ] Ubuntu 18.04 rejected with error message
- [ ] Ubuntu 16.04 rejected with error message

**Debian:**
- [ ] Debian 9 rejected with error message
- [ ] Debian 8 rejected with error message

**RHEL:**
- [ ] CentOS 7 rejected with error message
- [ ] RHEL 7 rejected with error message

**Expected:** Clear error message explaining version is EOL

### Test Case 5: Installation Error Recovery

**Objective:** Test error handling

**Test 5a: Network Failure**
- Disconnect network during package installation
- [ ] Error message displayed
- [ ] Script exits cleanly

**Test 5b: Insufficient Disk Space**
- Start with < 10GB free space
- [ ] Error message about disk space
- [ ] Installation aborts gracefully

---

## Post-Installation Testing

### Service Status Verification

**Check all services are running:**

```bash
# Web servers
systemctl status nginx
systemctl status apache2    # or httpd on RHEL

# PHP-FPM
systemctl status php8.3-fpm

# Database
systemctl status mariadb

# Mail
systemctl status exim4      # or exim on RHEL
systemctl status dovecot

# DNS
systemctl status bind9      # or named on RHEL

# Security
systemctl status fail2ban

# Vesta
systemctl status vesta
```

**Checklist:**
- [ ] All enabled services are "active (running)"
- [ ] No failed services
- [ ] Services auto-start on boot enabled

### Port Verification

**Test ports are listening:**

```bash
# Check listening ports
ss -tulpn | grep -E ':(80|443|8083|25|587|993|995|53|21)'
```

**Expected open ports:**
- [ ] 80 (HTTP) - nginx
- [ ] 443 (HTTPS) - nginx
- [ ] 8083 (Vesta panel)
- [ ] 25 (SMTP)
- [ ] 587 (Submission)
- [ ] 993 (IMAPS)
- [ ] 995 (POP3S)
- [ ] 53 (DNS)
- [ ] 21 (FTP)

### File System Verification

**Check directories created:**

```bash
# Vesta directories
ls -la /usr/local/vesta/
ls -la /usr/local/vesta/data/users/admin/

# Configuration files
ls -la /etc/php/8.3/
ls -la /etc/nginx/
ls -la /etc/apache2/  # or /etc/httpd/ on RHEL

# Installation info
cat /root/vesta_install_info.txt
```

**Checklist:**
- [ ] Vesta directory structure complete
- [ ] Admin user directory created
- [ ] Configuration files deployed
- [ ] Installation info file contains credentials

---

## Service Testing

### Web Server Testing

**Test 1: Nginx**
```bash
# Check configuration
nginx -t

# Test response
curl -I http://localhost
```
- [ ] Configuration valid
- [ ] HTTP responds (redirects or serves page)

**Test 2: Apache**
```bash
# Check configuration
apache2ctl -t  # or httpd -t on RHEL

# Test backend
curl -I http://localhost:8080
```
- [ ] Configuration valid
- [ ] Backend responds on port 8080

**Test 3: PHP-FPM**
```bash
# Check pool status
ps aux | grep php-fpm

# Test socket
ls -la /run/php/php8.3-fpm.sock
```
- [ ] PHP-FPM processes running
- [ ] Socket file exists and has correct permissions

### Database Testing

**Test 1: MariaDB Connection**
```bash
# Connect to database
mysql -u root -p  # Password from /root/.my.cnf

# Or use credentials file
mysql -e "SELECT VERSION();"
```
- [ ] Connection successful
- [ ] Version shows 10.11 or higher

**Test 2: Database Security**
```bash
mysql -e "SELECT user, host FROM mysql.user;"
```
- [ ] No anonymous users
- [ ] Root only from localhost
- [ ] Test database removed

### Mail Server Testing

**Test 1: Exim**
```bash
# Check Exim status
exim -bV

# Test mail queue
exim -bp
```
- [ ] Exim version displayed
- [ ] Queue accessible

**Test 2: Dovecot**
```bash
# Check Dovecot version
dovecot --version

# Test configuration
doveconf -n
```
- [ ] Dovecot version displayed
- [ ] Configuration valid

**Test 3: Send Test Email**
```bash
# Send test email
echo "Test email" | mail -s "Test from Vesta" test@example.com

# Check mail log
tail -f /var/log/exim4/mainlog
```
- [ ] Email queued
- [ ] No errors in log

### DNS Testing

**Test 1: Bind**
```bash
# Check Bind version
named -v

# Test configuration
named-checkconf
```
- [ ] Bind version displayed
- [ ] Configuration valid

**Test 2: DNS Query**
```bash
# Test DNS resolution
dig @localhost google.com
```
- [ ] Query successful
- [ ] Response received

### FTP Testing

**Test 1: vsftpd**
```bash
# Check status
systemctl status vsftpd

# Test FTP port
nc -zv localhost 21
```
- [ ] vsftpd running
- [ ] Port 21 accessible

---

## Security Testing

### Firewall Testing

**Test 1: Firewall Rules**
```bash
# Ubuntu/Debian
iptables -L -n

# RHEL
firewall-cmd --list-all
```
- [ ] Rules applied
- [ ] Required ports open
- [ ] Default deny policy

**Test 2: fail2ban**
```bash
# Check fail2ban status
fail2ban-client status

# Check jails
fail2ban-client status sshd
fail2ban-client status vesta
```
- [ ] fail2ban running
- [ ] Multiple jails active
- [ ] Jails monitoring logs

### SSL/TLS Testing

**Test 1: SSL Certificate**
```bash
# Check certificate
openssl s_client -connect localhost:8083 < /dev/null

# Or check certificate file
openssl x509 -in /usr/local/vesta/ssl/certificate.crt -text -noout
```
- [ ] Certificate present
- [ ] Valid (self-signed or Let's Encrypt)

**Test 2: TLS Version**
```bash
# Test TLS 1.2
openssl s_client -connect localhost:8083 -tls1_2 < /dev/null

# Test TLS 1.3
openssl s_client -connect localhost:8083 -tls1_3 < /dev/null
```
- [ ] TLS 1.2 accepted
- [ ] TLS 1.3 accepted
- [ ] TLS 1.0/1.1 rejected

### Password Security

**Test 1: Password Strength**
- [ ] Generated admin password is 10+ characters
- [ ] Contains mixed case, numbers, special chars
- [ ] MariaDB root password is strong

**Test 2: Credentials Storage**
```bash
# Check file permissions
ls -la /root/.my.cnf
ls -la /root/vesta_install_info.txt
```
- [ ] Files readable only by root (600)
- [ ] No world-readable credentials

---

## Functional Testing

### Control Panel Access

**Test 1: Panel Login**
1. Navigate to `https://SERVER_IP:8083`
2. Accept self-signed certificate (if applicable)
3. Login with admin credentials

**Checklist:**
- [ ] Panel loads without errors
- [ ] Login page displays
- [ ] Login successful with admin credentials
- [ ] Dashboard displays after login

**Test 2: Panel Navigation**
- [ ] All menu items accessible
- [ ] No broken links
- [ ] No JavaScript errors in console

### Domain Management

**Test 1: Add Domain**
1. Add test domain: `test.example.com`
2. Use template: Default
3. Enable SSL: No (for testing)

**Checklist:**
- [ ] Domain added successfully
- [ ] Apache/Nginx configs created
- [ ] DNS zone created
- [ ] Domain accessible via web

**Test 2: Domain Access**
```bash
# Test HTTP access
curl -H "Host: test.example.com" http://localhost

# Check DNS
host test.example.com localhost
```
- [ ] HTTP returns 200 or redirects
- [ ] DNS zone resolves

### User Management

**Test 1: Create User**
1. Create user: `testuser`
2. Set package: `default`
3. Set password

**Checklist:**
- [ ] User created successfully
- [ ] User home directory created
- [ ] PHP-FPM pool created for user
- [ ] User can login to panel

**Test 2: User Isolation**
```bash
# Check user processes
ps aux | grep testuser

# Check file permissions
ls -la /home/testuser/
```
- [ ] User processes isolated
- [ ] Correct file ownership
- [ ] User cannot access other users' files

### Database Management

**Test 1: Create Database**
1. Create database: `testdb`
2. Create database user: `testdbuser`

**Checklist:**
- [ ] Database created
- [ ] User created with access
- [ ] Can connect to database

**Test 2: phpMyAdmin**
1. Access phpMyAdmin
2. Login with database credentials

**Checklist:**
- [ ] phpMyAdmin accessible
- [ ] Login successful
- [ ] Database visible in listing

### Mail Management

**Test 1: Create Mail Domain**
1. Add mail domain: `mail.example.com`
2. Create mailbox: `test@mail.example.com`

**Checklist:**
- [ ] Mail domain created
- [ ] Mailbox created
- [ ] Exim accepts mail for domain
- [ ] Dovecot serves mailbox

**Test 2: Send/Receive Email**
1. Send test email to mailbox
2. Check mailbox for received email

**Checklist:**
- [ ] Email delivered
- [ ] Accessible via IMAP/POP3
- [ ] No errors in mail logs

---

## Performance Testing

### Load Testing

**Test 1: PHP Performance**
```bash
# Create test PHP file
echo '<?php phpinfo(); ?>' > /var/www/html/info.php

# Test with Apache Bench
ab -n 1000 -c 10 http://localhost/info.php
```
**Benchmarks:**
- [ ] 100+ requests per second
- [ ] < 100ms average response time
- [ ] No failed requests

**Test 2: Database Performance**
```bash
# Run mysqlslap
mysqlslap --concurrency=50 --iterations=100 --auto-generate-sql
```
**Benchmarks:**
- [ ] Completes without errors
- [ ] Reasonable query times

### Resource Usage

**Test 1: Memory Usage**
```bash
# Check memory
free -h

# Check per-service
systemctl status nginx apache2 mariadb php8.3-fpm
```
- [ ] Total usage < 80% of available RAM
- [ ] No services consuming excessive memory

**Test 2: CPU Usage**
```bash
# Monitor CPU
top -bn1 | head -20
```
- [ ] Idle CPU > 50% (at rest)
- [ ] No processes pegging CPU

---

## Automated Testing

### Quick Test Script

Create this script for rapid testing:

```bash
#!/bin/bash
# Vesta Quick Test Script

echo "=== Vesta Control Panel Quick Test ==="
echo

# Test 1: Service Status
echo "1. Testing Service Status..."
services="nginx apache2 php8.3-fpm mariadb exim4 dovecot bind9 fail2ban vesta"
for service in $services; do
    if systemctl is-active --quiet $service; then
        echo "  ✓ $service is running"
    else
        echo "  ✗ $service is NOT running"
    fi
done
echo

# Test 2: Port Accessibility
echo "2. Testing Port Accessibility..."
ports="80:HTTP 443:HTTPS 8083:Vesta 25:SMTP 993:IMAPS 53:DNS"
for port_desc in $ports; do
    port=$(echo $port_desc | cut -d: -f1)
    desc=$(echo $port_desc | cut -d: -f2)
    if ss -tuln | grep -q ":$port "; then
        echo "  ✓ Port $port ($desc) is listening"
    else
        echo "  ✗ Port $port ($desc) is NOT listening"
    fi
done
echo

# Test 3: PHP Version
echo "3. Testing PHP Version..."
php_version=$(php -r 'echo PHP_VERSION;')
echo "  PHP version: $php_version"
if [[ $php_version == 8.* ]]; then
    echo "  ✓ PHP 8.x detected"
else
    echo "  ✗ PHP version is not 8.x"
fi
echo

# Test 4: Database Connection
echo "4. Testing Database Connection..."
if mysql -e "SELECT 1;" &>/dev/null; then
    echo "  ✓ MariaDB connection successful"
    mysql_version=$(mysql -V)
    echo "  Version: $mysql_version"
else
    echo "  ✗ MariaDB connection failed"
fi
echo

# Test 5: Vesta Panel Access
echo "5. Testing Vesta Panel..."
if curl -k -s https://localhost:8083 | grep -q "Vesta\|vesta"; then
    echo "  ✓ Vesta panel is accessible"
else
    echo "  ✗ Vesta panel is NOT accessible"
fi
echo

# Test 6: File Permissions
echo "6. Testing File Permissions..."
if [ -f /root/vesta_install_info.txt ]; then
    echo "  ✓ Installation info file exists"
    perms=$(stat -c %a /root/vesta_install_info.txt)
    if [ "$perms" = "600" ] || [ "$perms" = "400" ]; then
        echo "  ✓ File permissions are secure ($perms)"
    else
        echo "  ⚠ File permissions may be insecure ($perms)"
    fi
else
    echo "  ✗ Installation info file not found"
fi
echo

echo "=== Test Complete ==="
```

Save as `/root/vesta-quick-test.sh` and run:
```bash
bash /root/vesta-quick-test.sh
```

---

## Test Reporting

### Test Report Template

```markdown
# Vesta Installation Test Report

**Test Date:** YYYY-MM-DD
**Tester:** Your Name
**Environment:** Ubuntu 22.04 LTS / Debian 11 / etc.

## Installation Details
- OS:
- PHP Version:
- Installation Method:
- Installation Duration:

## Test Results

### Pre-Installation: PASS / FAIL
- Comments:

### Installation: PASS / FAIL
- Comments:

### Post-Installation: PASS / FAIL
- Comments:

### Service Testing: PASS / FAIL
- Comments:

### Security Testing: PASS / FAIL
- Comments:

### Functional Testing: PASS / FAIL
- Comments:

### Performance Testing: PASS / FAIL
- Comments:

## Issues Found
1. Issue description
   - Severity: Critical / Major / Minor
   - Steps to reproduce:
   - Workaround:

## Overall Result: PASS / FAIL

## Recommendations
- Recommendation 1
- Recommendation 2
```

---

## Troubleshooting Common Test Failures

### Installation Fails

**Problem:** Package installation errors
**Solution:**
```bash
apt-get update
apt-get upgrade
# Re-run installer
```

**Problem:** Repository unavailable
**Solution:** Check internet connection and DNS resolution

### Service Won't Start

**Problem:** Service fails to start
**Solution:**
```bash
# Check logs
journalctl -xe -u service-name

# Check configuration
service-name -t  # Test config
```

### Panel Not Accessible

**Problem:** Cannot access panel at :8083
**Solution:**
```bash
# Check Vesta service
systemctl status vesta

# Check firewall
iptables -L -n | grep 8083

# Check SSL certificate
openssl s_client -connect localhost:8083
```

---

## Continuous Integration Testing

For automated CI/CD testing, use this GitHub Actions workflow:

```yaml
name: Vesta Installation Test

on: [push, pull_request]

jobs:
  test-ubuntu:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v2
      - name: Run Installer
        run: sudo bash install/INSTALL_COMPLETE.sh -e test@example.com
      - name: Run Tests
        run: sudo bash /root/vesta-quick-test.sh
```

---

## Conclusion

Following this testing guide ensures Vesta Control Panel installations are:
- ✅ Properly configured
- ✅ Secure
- ✅ Performant
- ✅ Functionally complete

For issues or questions, visit:
- GitHub Issues: https://github.com/outroll/vesta/issues
- Forum: https://forum.vestacp.com/
