# Migration Guide - Old Vesta to Modern Vesta

**Last Updated:** 2025-01-07
**Applies to:** Vesta 0.9.8.x → Modern Vesta 2.0

## ⚠️ CRITICAL WARNING

**DO NOT** perform in-place upgrades on production servers without:
1. Complete backup
2. Testing in staging environment
3. Planned maintenance window
4. Rollback plan

## Overview

This guide covers migrating from old Vesta installations (PHP 5.x/7.x) to modern Vesta (PHP 8.x).

## Prerequisites

### Before Migration

**Current System Check:**
```bash
# Check current PHP version
php -v

# Check current OS version
lsb_release -a

# Check MariaDB/MySQL version
mysql --version

# List all hosted domains
v-list-web-domains admin

# Check disk space
df -h
```

**Requirements for New System:**
- Ubuntu 20.04, 22.04, or 24.04 LTS
- OR Debian 10, 11, or 12
- OR Rocky/AlmaLinux 8 or 9
- Minimum 2GB RAM (4GB recommended)
- 20GB free disk space

## Migration Strategies

### Strategy 1: Fresh Install + Data Migration (RECOMMENDED)

**Best for:** Production servers, critical applications

**Steps:**

1. **Prepare New Server**
   ```bash
   # On new server with Ubuntu 22.04
   wget https://github.com/outroll/vesta/raw/master/install/INSTALL_COMPLETE.sh
   bash INSTALL_COMPLETE.sh --php 8.3 -e admin@example.com
   ```

2. **Backup Old Server**
   ```bash
   # On old server
   v-backup-users

   # Create additional backup
   tar -czf /backup/vesta-migration-$(date +%Y%m%d).tar.gz \
       /home/*/web \
       /home/*/mail \
       /var/lib/mysql \
       /usr/local/vesta/data
   ```

3. **Transfer Data**
   ```bash
   # From old server to new
   rsync -avz -e ssh /backup/vesta-*.tar.gz root@new-server:/backup/
   rsync -avz -e ssh /usr/local/vesta/data/users/ root@new-server:/usr/local/vesta/data/users/
   ```

4. **Restore on New Server**
   ```bash
   # On new server
   v-restore-user admin backup-file.tar.gz

   # Or manually restore databases
   mysql -u root -p database_name < backup.sql
   ```

5. **Test Applications**
   ```bash
   # Test each domain for PHP 8 compatibility
   # Check error logs
   tail -f /var/log/php8.3-fpm-error.log
   ```

6. **Update DNS**
   ```bash
   # Point domains to new server IP
   # Wait for DNS propagation
   # Keep old server running during transition
   ```

### Strategy 2: In-Place Upgrade (NOT RECOMMENDED)

**Risk Level:** HIGH
**Use only for:** Development/testing environments

⚠️ **This method can break your server. Use at your own risk.**

**Steps:**

1. **Full Backup**
   ```bash
   # Backup EVERYTHING
   v-backup-users
   mysqldump --all-databases > /backup/all-databases.sql
   tar -czf /backup/vesta-complete.tar.gz /usr/local/vesta /home /var/lib/mysql
   ```

2. **Upgrade OS**
   ```bash
   # Ubuntu 18.04 → 20.04 → 22.04
   do-release-upgrade

   # Reboot and verify
   lsb_release -a
   ```

3. **Add PHP 8.3**
   ```bash
   # Ubuntu
   add-apt-repository ppa:ondrej/php
   apt update
   apt install php8.3-fpm php8.3-cli php8.3-mysql php8.3-gd \
       php8.3-mbstring php8.3-xml php8.3-curl
   ```

4. **Update Vesta Configurations**
   ```bash
   # Replace old configs with new ones
   cp /path/to/modern/configs/php/php.ini /etc/php/8.3/fpm/
   cp /path/to/modern/configs/nginx/nginx.conf /etc/nginx/

   # Rebuild domains
   v-rebuild-web-domains admin
   ```

5. **Test Everything**
   ```bash
   # Check all services
   systemctl status nginx apache2 php8.3-fpm mysql

   # Test each website
   # Fix PHP 8 compatibility issues
   ```

## PHP 8 Compatibility Issues

### Common Breaking Changes

**1. Deprecated Functions Removed**
```php
// Old (PHP 7)
create_function('$a,$b', 'return $a+$b;');

// New (PHP 8)
fn($a, $b) => $a + $b;
```

**2. Strict Type Checking**
```php
// Old - This worked in PHP 7
function add(int $a, int $b) {
    return $a + $b;
}
add("1", "2"); // Worked

// PHP 8 - Strict types enforced
add("1", "2"); // TypeError
```

**3. NULL Handling**
```php
// Old - strlen(null) returned 0
strlen(null);

// PHP 8 - Triggers deprecation/error
strlen($var ?? ''); // Use null coalescing
```

### Testing for Compatibility

**Automated Testing:**
```bash
# Install PHPCompatibility
composer require --dev phpcompatibility/php-compatibility

# Check codebase
vendor/bin/phpcs -p /path/to/code --standard=PHPCompatibility --runtime-set testVersion 8.3
```

**Manual Testing:**
```bash
# Enable error reporting
echo "error_reporting = E_ALL" >> /etc/php/8.3/fpm/php.ini
echo "display_errors = On" >> /etc/php/8.3/fpm/php.ini

# Restart PHP-FPM
systemctl restart php8.3-fpm

# Visit each site and check for errors
```

## Database Migration

### MariaDB 10.3 → 10.11

**1. Backup**
```bash
mysqldump --all-databases > /backup/pre-upgrade.sql
```

**2. Upgrade**
```bash
# Ubuntu/Debian
apt upgrade mariadb-server

# Or install newer version
wget https://downloads.mariadb.com/MariaDB/mariadb_repo_setup
bash mariadb_repo_setup --mariadb-server-version=10.11
apt install mariadb-server
```

**3. Run Upgrade**
```bash
mysql_upgrade
systemctl restart mariadb
```

**4. Test**
```bash
mysql -e "SELECT VERSION();"
mysql -e "SHOW DATABASES;"
```

### MySQL 5.7 → 8.0

**Authentication Plugin Change:**
```sql
-- Check current auth plugins
SELECT user, host, plugin FROM mysql.user;

-- Update to mysql_native_password if needed
ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```

## Application-Specific Migrations

### WordPress

**1. Update WordPress Core**
```bash
cd /home/user/web/domain/public_html
wp core update --allow-root
```

**2. Update Plugins**
```bash
wp plugin update --all --allow-root
```

**3. Test PHP 8 Compatibility**
```bash
wp plugin list --allow-root
# Check each plugin for PHP 8 support
```

**4. Common Issues:**
- WooCommerce: Requires 5.x+ for PHP 8
- Contact Form 7: Update to latest
- Yoast SEO: Update to 19.x+

### Joomla

**1. Check Requirements**
- Joomla 4.x required for PHP 8
- Joomla 3.x max PHP 7.4

**2. Upgrade Path**
```bash
# Backup first
# Then upgrade Joomla 3 → 4
# Then migrate to PHP 8
```

### Drupal

**1. Drupal 9.4+ supports PHP 8.1**
**2. Drupal 10 requires PHP 8.1+**

```bash
composer require drupal/core-recommended:^10
drush updatedb
drush cache:rebuild
```

## Configuration Migrations

### Nginx

**Old Configuration:**
```nginx
location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.0-fpm.sock;
}
```

**New Configuration:**
```nginx
location ~ \.php$ {
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
}
```

### Apache

**Old Configuration:**
```apache
<FilesMatch \.php$>
    SetHandler "proxy:unix:/var/run/php/php7.0-fpm.sock|fcgi://localhost"
</FilesMatch>
```

**New Configuration:**
```apache
<FilesMatch \.php$>
    SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
</FilesMatch>
```

### PHP-FPM Pools

**Update socket paths in `/etc/php/8.3/fpm/pool.d/*.conf`:**
```ini
[user]
listen = /run/php/php8.3-fpm-user.sock
```

## SSL Certificate Migration

### Let's Encrypt

**Old certbot → New acme.sh:**
```bash
# Export existing certificates
certbot certificates

# Install acme.sh
curl https://get.acme.sh | sh

# Re-issue certificates
~/.acme.sh/acme.sh --issue -d domain.com -w /home/user/web/domain/public_html
```

## Email Migration

**Dovecot & Exim** configurations remain largely compatible.

**Update mail client settings if needed:**
- IMAP: port 993 (SSL)
- SMTP: port 587 (TLS)
- POP3: port 995 (SSL)

## Post-Migration Checklist

### Verification Steps

```bash
# Check all services
systemctl status nginx apache2 php8.3-fpm mariadb exim4 dovecot

# Check PHP version
php -v

# Test domains
curl -I https://yourdomain.com

# Check logs
tail -f /var/log/nginx/error.log
tail -f /var/log/php8.3-fpm-error.log
tail -f /var/log/mysql/error.log

# Verify SSL
openssl s_client -connect yourdomain.com:443

# Test email
echo "Test" | mail -s "Test Email" user@domain.com

# Check fail2ban
fail2ban-client status
```

### Performance Tuning

**1. PHP OPcache**
```bash
# Check OPcache status
php -r "print_r(opcache_get_status());"
```

**2. MySQL Query Cache**
```sql
-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log%';
```

**3. Nginx Cache**
```bash
# Monitor cache hits
tail -f /var/log/nginx/access.log | grep "HIT\|MISS"
```

## Rollback Procedure

**If migration fails:**

1. **Restore from backup**
   ```bash
   # Stop services
   systemctl stop nginx apache2 php8.3-fpm mysql

   # Restore data
   tar -xzf /backup/vesta-complete.tar.gz -C /

   # Restore database
   mysql < /backup/all-databases.sql

   # Start services
   systemctl start nginx apache2 php7.4-fpm mysql
   ```

2. **Point DNS back to old server**

3. **Investigate issues before retry**

## Common Issues & Solutions

### Issue: "502 Bad Gateway"
**Solution:**
```bash
# Check PHP-FPM is running
systemctl status php8.3-fpm

# Check socket permissions
ls -la /run/php/

# Verify nginx config points to correct socket
grep fastcgi_pass /etc/nginx/sites-enabled/*
```

### Issue: "Database Connection Error"
**Solution:**
```bash
# Check MariaDB is running
systemctl status mariadb

# Verify credentials in config files
grep DB_PASSWORD /home/*/web/*/public_html/wp-config.php

# Test connection
mysql -u username -p database_name
```

### Issue: "White Screen of Death" (WordPress)
**Solution:**
```bash
# Enable debugging
echo "define('WP_DEBUG', true);" >> wp-config.php
echo "define('WP_DEBUG_LOG', true);" >> wp-config.php

# Check logs
tail -f /home/user/web/domain/public_html/wp-content/debug.log
```

## Support Resources

- **Documentation:** https://vestacp.com/docs/
- **Forum:** https://forum.vestacp.com/
- **GitHub Issues:** https://github.com/outroll/vesta/issues
- **Community Chat:** https://gitter.im/vesta-cp/Lobby

## Professional Migration Services

For complex migrations, consider hiring professional services:
- System administrator consultation
- Application compatibility testing
- Custom migration scripts
- 24/7 support during migration

## Conclusion

**Migration Timeline:**
- **Planning:** 1-2 days
- **Testing:** 3-5 days
- **Execution:** 1 day
- **Verification:** 2-3 days
- **Total:** 1-2 weeks

**Success Rate:**
- Fresh install + migration: 95% success
- In-place upgrade: 60% success (not recommended)

**Remember:** Always backup, test thoroughly, and have a rollback plan!

---

**Document Version:** 1.0
**Contributors:** Vesta Community
**License:** GPL v3
