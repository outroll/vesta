Version 0.9.8-26-26 [27-Jun-2020]
==================================================
* [Feature] Self-signed SSL will be automaticaly added when you add new domain
* [Feature] Script for adding self-signed SSL to desired domain
* From now, on fresh installed server, default backup cron goes at Saturday at 01 AM (instead of everyday at 05 AM)
* New favicon for hosting panel

Version 0.9.8-26-25 [23-Jun-2020]
==================================================
* [Security] Fixing unnecessary slash in nginx configs for phpmyadmin and roundcube
* [Security] Adding escapeshellarg on few more places in php code

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
* [Bugfix] Putv mail_max_userip_connections = 50 in dovecot

Version 0.9.8-26-16 [15-May-2020]
==================================================
* [Bugfix] Allow quick restarting of nginx if acme-challenge should be added many times
* [Bugfix] Enabling email notification  to fresh installed servers about backup success status
* [Bugfix] Timeout 10 sec for apache2 status
