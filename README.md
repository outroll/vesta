MyVesta Control Panel
==================================================

* MyVesta is a fork of VestaCP
* Focused on security and stability
* Therefore, only Debian is supported - keeping focus on ONE eco-system - not wasting energy on compatibility with other Linux distributions
* It will always be synchronized with official VestaCP commits
* All VestaCP commercial plugins can be purchased only on official vestacp.com - we will not take their earnings - we are not making this because of money
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

