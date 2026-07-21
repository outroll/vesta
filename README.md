[Vesta Control Panel](http://vestacp.com/)
==================================================

Vesta is back under active development as of 25 February 2024. We are commited to open source, and will engage with the community to identify the new roadmap for Vesta. Stay tuned!

[![Join the chat at https://gitter.im/vesta-cp/Lobby](https://badges.gitter.im/vesta-cp/Lobby.svg)](https://gitter.im/vesta-cp/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

* Vesta is an open source hosting control panel.
* Vesta has a clean and focused interface without the clutter.
* Vesta has the latest of very innovative technologies.

How to install (2 step)
----------------------------
Connect to your server as root via SSH
```bash
ssh root@your.server
```

Download the installation script, and run it:
```bash
curl https://vestacp.com/pub/vst-install.sh | bash
```

How to install (BETA and in-progress work versions)
----------------------------
Connect to your server as root via SSH
```bash
ssh root@your.server
```

Clone this repository and run the installer for your OS from `install/`:
```bash
git clone https://github.com/outroll/vesta.git
cd vesta/install
sudo ./vst-install-ubuntu.sh   # or vst-install-debian.sh / vst-install-rhel.sh / vst-install-amazon.sh
```

Run the script with `--help` to see the available options (admin email/password,
which services to install, etc).

> Older versions of this README pointed to `curl https://vestacp.com/pub/vst-install.sh`.
> That endpoint is hosted separately from this repository and won't reflect any
> changes made here -- always install from a checkout of this repo instead.

License
----------------------------
Vesta is licensed under  [GPL v3 ](https://github.com/outroll/vesta/blob/master/LICENSE) license

