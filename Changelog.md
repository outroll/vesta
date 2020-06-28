Version 0.9.8-26-26 [27-Jun-2020]
==================================================
* [Feature] Self-signed SSL will be automaticaly added when you add new domain
* [Feature] Script for adding self-signed SSL to desired domain
* From now, on fresh installed server, default backup cron goes at Saturday at 01 AM (instead of everyday at 05 AM)
* New favicon for hosting panel

Version 0.9.8-26-25 [23-Jun-2020]
==================================================
* [Security] Fixing unnecessary slash in nginx configs for phpmyadmin and roundcube (Credits to Bernardo Berg @bberg1984 for finding this issue!)
* [Security] Adding escapeshellarg on few more places in php code (Credits to Talha Günay and @Lupul for finding these places)

Version 0.9.8-26-24 [22-Jun-2020]
==================================================
* [Bugfix] nginx + php-fpm installer variant now finally works

Version 0.9.8-26-23 [14-Jun-2020]
==================================================
* Adding label that LetsEncrypt can be added when you Edit domain

Version 0.9.8-26-22 [13-Jun-2020]
==================================================
* [Bugfix] Checking (in order to delete) php7.4 pool config file while deleting domain

Version 0.9.8-26-21 [13-Jun-2020]
==================================================
* [Feature] Blocking executable files inside archives in received emails (ClamAV)
* [Bugfix] Removing ability to schedule LetsEncrypt issuing while adding new domain (because it can fall in infinite loop whole day)
* [Bugfix] Force acme-challenge to use Apache if myVesta is behind main nginx
* [Bugfix] Adding http2 support to nginx caching.tpl
* [Bugfix] Script that removes depricated 'ssl on;' in nginx templates
* [Security] Ensure UPDATE_SSL_SCRIPT is not set in some config files

Version 0.9.8-26-20 [01-Jun-2020]
==================================================
* [Bugfix] Script that will ensure that Apache2 will always stay in mpm_event mode
* [Bugfix] Ensure config files will not be overwritten while updating vesta-nginx package
* [Bugfix] Fixing URL in v-update-web-templates script
* [Feature] Additional rates for nginx anti-denial-of-service templates

Version 0.9.8-26-19 [15-May-2020]
==================================================
* [Bugfix] Do not match subdomains while restoring domain [v-restore-user]

Version 0.9.8-26-18 [15-May-2020]
==================================================
* [Bugfix] Fixing NS parameters in v-add-dns-on-web-alias

Version 0.9.8-26-17 [15-May-2020]
==================================================
* [Bugfix] Reverting default clamav socket path 
* [Bugfix] Put mail_max_userip_connections = 50 in dovecot

Version 0.9.8-26-16 [15-May-2020]
==================================================
* [Bugfix] Allow quick restarting of nginx if acme-challenge should be added many times
* [Bugfix] Enabling email notification to fresh installed servers about backup success status
* [Bugfix] Timeout 10 sec for apache2 status

Version 0.9.8-26-15 [09-May-2020]
==================================================
* [Feature] nginx templates that can prevent denial-of-service on your server
* New logo

Version 0.9.8-26-14 [08-May-2020]
==================================================
* v-clone-website script switched to parameters
* Display new version in console while updating myVesta

Version 0.9.8-26-13 [07-May-2020]
==================================================
* [Feature] Put build date and version in right-bottom corner of control panel

Version 0.9.8-26-12 [07-May-2020]
==================================================
* [Feature] Put build date and version while compiling myVesta
* [Feature] Office365 DNS template
* [Feature] Yandex DNS template
* ProFTPD MaxIstances = 100 for fresh installed servers

Version 0.9.8-26-11 [01-May-2020]
==================================================
* [Feature] Skipping LE renewing after 7 failed attempts
* [Bugfix] Keep conf files during auto-update
* [Bugfix] Do not restart apache while preparing letsencrypt acme challenge
* [Bugfix] Set ALLOW_BACKUP_ANYTIME='yes' for fresh installed servers

Version 0.9.8-26-10 [11-Apr-2020]
==================================================
* [Feature] Creating v-normalize-restored-user script (normalize NS1, NS2 and IP of account that is backuped on other server and restored on this server)
* Tweak for hostname FPM conf
* [Security] Forbid changing root password (Credits to Alexandre ZANNI, Orange Cyberdefense, https://cyberdefense.orange.com)
* [Security] Importing system enviroment in v-change-user-password (Credits to Alexandre ZANNI, Orange Cyberdefense, https://cyberdefense.orange.com)

Version 0.9.8-26-9 [23-Mar-2020]
==================================================
* [Security] Preventing manipulation with $SERVER['HTTP_HOST'] (Credits to @mdisec - Managing Partner of PRODAFT / INVICTUS A.Ş. Master ninja at pentest.blog)

Version 0.9.8-26-8 [23-Mar-2020]
==================================================
* [Security] Temporary fix for parsing backup conf (Credits to @dreiggy - https://pentest.blog/vesta-control-panel-second-order-remote-code-execution-0day-step-by-step-analysis/)

Version 0.9.8-26-7 [18-Mar-2020]
==================================================
* [Bugfix] Fix that avoid LetsEncrypt domain validation timeout
* [Bugfix] Set timeout in v-list-sys-web-status script

Version 0.9.8-26-6 [21-Feb-2020]
==================================================
* [Bugfix] mail-wrapper.php from now works
* [Feature] Introducing NOTIFY_ADMIN_FULL_BACKUP, email notification about backup success status
* [Feature] Introducing KEEP_N_FTP_BACKUPS, ability to limit number of remote FTP backups
* [Feature] Introducing force-https-webmail-phpmyadmin nginx template
* [Feature] Trigger for /root/update_firewall_custom.sh

Version 0.9.8-26-5 [10-Feb-2020]
==================================================
* [Security] sudoers fix for Debian10
* [Feature] [Script that will migrate your site from http to https, replacing http to https URLs in database](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/v-migrate-site-to-https)
* [Feature] [Cloning script that will copy the whole site from one domain to another (sub)domain](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/v-clone-website)
* [Feature] [Script that will install multiple PHP versions on your server](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/multi-php-install.sh)
* [Bugfix] Roundcube force https
* [Bugfix] Exim compatibility with Loopia for Debian10

Version 0.9.8-26-4 [07-Jan-2020]
==================================================
* [Feature] Allow whitelisting specific IP for /api/
* [Feature] Allow whitelisting specific IP to avoid secret_url
* [Feature] Allow Softaculous in secure_login gateway
* [Bugfix] apparmor install fix again
* [Bugfix] Turning off MariaDB SQL strict mode

Version 0.9.8-26-3 [26-Nov-2019]
==================================================
* [Feature] Support for sub-releases
* [Bugfix] Better check if session cron already added

Version 0.9.8-26-2 [15-Nov-2019]
==================================================
* [Feature] Support for sub-sub-sub-sub versions :))
* [Bugfix] Support for longer username of email accounts
* [Bugfix] apparmor install fix
* [Bugfix] Trying to fix ClamAV broken socket
* Moving to myvestacp.com

Version 0.9.8-26 [28-Sep-2019]
==================================================
* [Bugfix] Let's Encrypt HTTP/2 support (by @serghey-rodin)
* [Bugfix] Fixing broken autoreply output
* [Feature] Multi-PHP support for PHP 7.4
* [Feature] Multi-PHP installer for Debian 8
* [Bugfix] Cron for removing old PHP sessions files
* [Bugfix] New CloudFlare IPs
* [Security] MySQL port blocked by default from outside
* [Feature] Warning when server hostname is not pointing to server IP
* [Feature] max_length_of_MySQL_username=80

Older versions
==================================================
* Support for Debian 10 (previous Debian releases are also supported, but Debian 10 is recommended)
* [Support for multi-PHP versions](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/multi-php-install.sh)
* You can limit the maximum number of sent emails (per hour) [per mail account](https://github.com/myvesta/vesta/blob/master/install/debian/10/exim/exim4.conf.template#L105-L106) and [per hosting account](https://github.com/myvesta/vesta/blob/master/install/debian/10/exim/exim4.conf.template#L65-L66), preventing hijacking of email accounts and preventing PHP malware scripts to send spam.
* You can see [what PHP scripts are sending emails](https://github.com/myvesta/vesta/blob/master/install/debian/10/php/php7.3-dedi.patch#L50), when and to whom
* You can completely "lock" myVesta so it can be accessed only via **secret URL**, for example https://serverhost:8083/?MY-SECRET-URL
    + Literally no PHP scripts will be alive on your hosting panel (won't be able to get executed), unless you access the hosting panel with secret URL parameter. Thus, when it happens that, let's say, some zero-day exploit pops up - attackers won't be able to access it without knowing your secret URL - PHP scripts from myVesta
* We [disabled dangerous PHP functions](https://github.com/myvesta/vesta/blob/master/install/debian/10/php/php7.3-dedi.patch#L9) in php.ini, so even if, for example, your customer's CMS gets compromised, hacker will not be able to execute shell scripts from within PHP.
* Apache is fully switched to mpm_event mode, while PHP is running in PHP-FPM mode, which is the most stable PHP-stack solution
    + OPCache is turned on by default
* Auto-generating LetsEncrypt SSL for server hostname (signed SSL for Vesta 8083 port, for dovecot (IMAP & POP3) and for Exim (SMTP))
* You can change Vesta port during installation or later using one command line: **v-change-vesta-port [number]**
* Backup will run with lowest priority (to avoid load on server), and can be configured to run only by night (and to stop on the morning and continue next night)
* You can compile Vesta binaries by yourself
* [Script that will convert Vesta to myVesta](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/convert-vesta-to-myvesta.sh)
* [Wordpress installer in one second](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/create_wp_https)
* [Script for importing cPanel backups to Vesta](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/cpanel-import.sh)
* [Official Vesta Softaculous installer](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/install-softaculous.sh)
