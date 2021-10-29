#!/bin/bash
# Add notifications

rm -f /usr/local/vesta/data/users/admin/notifications.conf
/usr/local/vesta/bin/v-add-user-notification admin "File Manager" "Browse, copy, edit, view, and retrieve all your web domain files using a fully featured <a href='http://vestacp.com/features/#filemanager'>File Manager</a>. Plugin is available for <a href='/edit/server/?lead=filemanager#module-filemanager'>purchase</a>." 'filemanager'
/usr/local/vesta/bin/v-add-user-notification admin "Chroot SFTP" "If you want to have SFTP accounts that will be used only to transfer files (and not to SSH), you can  <a href='/edit/server/?lead=sftp#module-sftp'>purchase</a> and enable <a href='http://vestacp.com/features/#sftpchroot'>SFTP Chroot</a>"
/usr/local/vesta/bin/v-add-user-notification admin "Softaculous" "Softaculous is one of the best Auto Installers and it is finally <a href='/edit/server/?lead=sftp#module-softaculous'>available</a>"
/usr/local/vesta/bin/v-add-user-notification admin "Release 1.0.0-1" "This release brings a new UI that is much more pleasant to use. We've also fixed a dozen bugs and added support for the new Linux Distros. For more information please check <a href='http://vestacp.com/history/#1.0.0-1'>release notes</a>"
