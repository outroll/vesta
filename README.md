MyVesta Control Panel
==================================================

* MyVesta is a fork of VestaCP
* Focused on security and stability
* Therefore, only Debian is supported - keeping focus on ONE eco-system - not wasting energy on compatibility with other Linux distributions
* It will always be synchronized with official VestaCP commits
* All VestaCP commercial plugins can be purchased only on official vestacp.com - we will not take their earnings - we are not making this because of money

Features
==================================================

> + Apache is on mpm_event by default, PHP is running in PHP-FPM

> + You can totally "lock" VestsCP so it can be accessed only via https://serverhost:8083/?MY-SECRET-URL
> After installation just execute:
> ```
> echo "<?php \$login_url='MY-SECRET-URL';" > /usr/local/vesta/web/inc/login_url.php
> ```
> Literally no one PHP script will be alive before you access that URL, so even if there is some zero-day exploit - hacker will not be able to access it without knowing your secret URL.
> You can see how mechanism was built by looking at:
>   + https://github.com/myvesta/vesta/blob/master/src/deb/php/php.ini#L496
>   + https://github.com/myvesta/vesta/blob/master/web/inc/secure_login.php

> + We disabled dangerous PHP functions in php.ini, so even if customer's CMS was compromised, hacker will not be able to execute shell from PHP.

About VestaCP
==================================================

* Vesta is an open source hosting control panel.
* Vesta has a clean and focused interface without the clutter.
* Vesta has the latest of very innovative technologies.

Special thanks to vestacp.com and Serghey Rodin for open-source VestaCP project

How to install (2 step)
----------------------------
Connect to your server as root via SSH
```bash
ssh root@your.server
```

Download the installation script, and run it:
```bash
curl http://c.vesta.hostingpanel.dev/vst-install-debian.sh | bash
```

How to install (3 step)
----------------------------
If the above example does not work, try this 3 step method:
Connect to your server as root via SSH
```bash
ssh root@your.server
```

Download the installation script:
```bash
curl -O http://c.vesta.hostingpanel.dev/vst-install-debian.sh
```
Then run it:
```bash
bash vst-install-debian.sh
```

License
----------------------------
Vesta is licensed under  [GPL v3 ](https://github.com/serghey-rodin/vesta/blob/master/LICENSE) license

