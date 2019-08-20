MyVesta Control Panel
==================================================

* MyVesta is a fork of VestaCP
* Focused on security and stability
* Therefore, only Debian is supported - keeping focus on ONE eco-system - not wasting energy on compatibility with other Linux distributions
* It will always be synchronized with official VestaCP commits
* All VestaCP commercial plugins can be purchased only on official vestacp.com - we will not take their earnings - we are not making this fork because of money - but because a freedom to enhance security and features
* All features that is added here will be offered to official VestaCP through pull-requests

Features
==================================================

+ Support for Debian 10

+ You can totally "lock" VestsCP so it can be accessed only via https://serverhost:8083/?MY-SECRET-URL
    + After MyVesta installation just execute:
    + `echo "<?php \$login_url='MY-SECRET-URL';" > /usr/local/vesta/web/inc/login_url.php`
    + Literally no one PHP script will be alive before you access that URL, so even if there is some zero-day exploit - hacker will not be able to access it without knowing your secret URL. PHP scripts from VestaCP will be simlpy dead - nothing will interact with someone who don't know your secret-URL.
    + You can see how mechanism was built by looking at:
      + https://github.com/myvesta/vesta/blob/master/src/deb/for-download/php/php.ini#L496
      + https://github.com/myvesta/vesta/blob/master/web/inc/secure_login.php

+ We disabled dangerous PHP functions in php.ini, so even if customer's CMS was compromised, hacker will not be able to execute shell from PHP.

+ Apache is fully switched to mpm_event mode, PHP is running in PHP-FPM, which is the most stable PHP-stack solution
    + OPCache is turned on by default

+ Support for multi-PHP versions - https://forum.vestacp.com/viewtopic.php?t=17129

+ You can compile Vesta binaries by yourself - https://github.com/myvesta/vesta/blob/master/src/deb/vesta_compile.sh
    + You can even create your own APT repositorium in a minute
    + We are using latest nginx version for vesta-nginx package
    + With your own APT infrastructure you can take a security of Vesta-installer infrastructure in your own hands, you have full control of your Vesta code

How to install
----------------------------
Download the installation script:
```bash
curl -O http://c.vesta.hostingpanel.dev/vst-install-debian.sh
```
Then run it:
```bash
bash vst-install-debian.sh
```

About VestaCP
==================================================

* Vesta is an open source hosting control panel.
* Vesta has a clean and focused interface without the clutter.
* Vesta has the latest of very innovative technologies.

Special thanks to vestacp.com and Serghey Rodin for open-source VestaCP project

License
----------------------------
Vesta is licensed under  [GPL v3 ](https://github.com/serghey-rodin/vesta/blob/master/LICENSE) license

