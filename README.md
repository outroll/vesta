[Vesta Control Panel](http://vestacp.com/)
==================================================

* Vesta is an open source hosting control panel.
* Vesta has a clean and focused interface without the clutter.
* Vesta has the latest of very innovative technologies.


How to install
----------------------------
Connect to your server as root via SSH
```bash
ssh root@your.server
```

Run this command to delete previous install files, download the latest, and run it.
```bash
rm vst-install*.sh && curl http://vestacp.com/pub/vst-install.sh | bash; bash ./vst-install-*.sh
```

If the above example does not work, try this 2 step method:

Download the installation script:
```bash
curl -O http://vestacp.com/pub/vst-install.sh
```
Then run it:
```bash
bash vst-install.sh
```

License
----------------------------
Vesta is licensed under  [GPL v3 ](https://github.com/serghey-rodin/vesta/blob/master/LICENSE) license

