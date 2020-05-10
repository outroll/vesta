MyVesta Control Panel
==================================================

* MyVesta is a fork of VestaCP
* Focused on security and stability
* Therefore, only Debian is supported - keeping focus on only one eco-system - not wasting energy on compatibility with other Linux distributions
* However, it will be always synchronized with official VestaCP commits
* VestaCP commercial plugins will be only available for purchase on official vestacp.com website - we will NOT take their earnings, since we are not making this fork for monetary reasons. Instead, we are doing this with open source in mind - to enhance security and to build new features, without being interlocked with official VestaCP release cycles, and without affecting or heavily diverting from the VestaCP's planned development milestones
* With previous in mind, all features that are built for this fork (MyVesta), will be offered to official VestaCP, via pull requests

Features
==================================================

+ Support for Debian 10 (previous releases are also supported)

+ [nginx templates](https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/rate-limit-tpl/install_rate_limit_tpl.sh) that can prevent denial-of-services

+ You can completely "lock" VestaCP so it can be accessed only via https://serverhost:8083/?MY-SECRET-URL
    + During installation you will be asked to choose a secret URL for your hosting panel
    + Literally no PHP scripts will be alive on your hosting panel (won't be able to get executed), unless you access the hosting panel with secret URL parameter. Thus, when it happens that, let's say, some zero-day exploit pops up - attackers won't be able to access it without knowing your secret URL. PHP scripts from VestaCP will be simply dead - no one will be able to interact with your panel unless they have the secret URL.
    + You can see for yourself how this mechanism was built by looking at:
      + https://github.com/myvesta/vesta/blob/master/src/deb/for-download/php/php.ini#L496
      + https://github.com/myvesta/vesta/blob/master/web/inc/secure_login.php
    + If you didn't set the secret URL during installation, you can do it anytime. Just execute in shell:
    + `echo "<?php \$login_url='MY-SECRET-URL';" > /usr/local/vesta/web/inc/login_url.php`

+ We disabled dangerous PHP functions in php.ini, so even if, for example, your customer's CMS gets compromised, hacker will not be able to execute shell scripts from within PHP.

+ Apache is fully switched to mpm_event mode, while PHP is running in PHP-FPM mode, which is the most stable PHP-stack solution
    + OPCache is turned on by default

+ Support for multi-PHP versions - https://github.com/myvesta/vesta/blob/master/src/deb/for-download/tools/multi-php-install.sh

+ Auto-generating LetsEncrypt SSL for server hostname (signed SSL for Vesta 8083 port, for dovecot (IMAP & POP3) and for Exim (SMTP))

+ You can change Vesta port during installation or later using one command line: **v-change-vesta-port [number]**

+ You can limit the maximum number of sent emails (per hour) per mail account and per hosting account.

+ You can compile Vesta binaries by yourself - https://github.com/myvesta/vesta/blob/master/src/deb/vesta_compile.sh
    + You can even create your own APT repository in a minute
    + We are using latest nginx version for vesta-nginx package
    + With your own APT infrastructure you can take security of Vesta-installer infrastructure in your own hands. You will have full control of your Vesta code (this way you can rest assured that there's 0% chance that you'll install malicious packages from repositories that may get hacked)
    + Binaries that you compile are 100% compatible with official VestaCP from vestacp.com, so you can run official VestaCP code with your own binaries (in case you don't want the source code from this fork)

How to install
----------------------------
Download the installation script:
```bash
curl -O http://c.myvestacp.com/vst-install-debian.sh
```
Then run it:
```bash
bash vst-install-debian.sh
```

About VestaCP
==================================================

* Vesta is an open source hosting control panel.
* Vesta has a clean and focused interface without clutter.
* Vesta has the latest of very innovative technologies.

Special thanks to vestacp.com and Serghey Rodin for open-source VestaCP project

License
----------------------------
Vesta is licensed under  [GPL v3 ](https://github.com/serghey-rodin/vesta/blob/master/LICENSE) license

