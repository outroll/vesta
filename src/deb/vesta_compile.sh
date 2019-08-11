#!/bin/bash

# Autocompile Script for VestaCP deb Files.
# Made for MyVesta fork.
# Autocompile script borrowed from HestiaCP, special thanks to Raphael Schneeberger

wait_to_press_enter=1
run_apt_update_and_install=1
add_deb_to_apt_repo=0

DEB_NAME='buster'
DEB_VER='10'
VESTA_VER='0.9.8-25'

# Set compiling directory
BUILD_DIR="/usr/src/$DEB_NAME"
INSTALL_DIR="/usr/local/vesta"

# Set git repository raw path
GIT_SRC='https://raw.githubusercontent.com/myvesta/vesta/master/src'
GIT_REP="$GIT_REP/deb"

PATH_OF_C_WEB_FOLDER="/var/www/c.vesta.hostingpanel.dev/html"
PATH_OF_C_WEB_FOLDER_FOR_SPECIFIC_DEB_VER="$PATH_OF_C_WEB_FOLDER/debian/$DEB_VER"
PATH_OF_APT_REPO="/var/www/apt.vesta.hostingpanel.dev/html/$DEB_NAME"

# Set Version for compiling
VESTA_V=$VESTA_VER"_amd64"
NGINX_V='1.17.1'
OPENSSL_V='1.1.1c'
PCRE_V='8.43'
ZLIB_V='1.2.11'
PHP_V='5.6.40'

# Generate Links for sourcecode
NGINX='https://nginx.org/download/nginx-'$NGINX_V'.tar.gz'
OPENSSL='https://www.openssl.org/source/openssl-'$OPENSSL_V'.tar.gz'
PCRE='https://ftp.pcre.org/pub/pcre/pcre-'$PCRE_V'.tar.gz'
ZLIB='https://www.zlib.net/zlib-'$ZLIB_V'.tar.gz'
PHP='http://de2.php.net/distributions/php-'$PHP_V'.tar.gz'

# Set package dependencies for compiling
SOFTWARE='build-essential libxml2-dev libz-dev libcurl4-gnutls-dev unzip openssl libssl-dev pkg-config reprepro dpkg-sig'

function press_enter {
    if [ $wait_to_press_enter -eq 1 ]; then
        read -p "$1"
    else
        echo $1
    fi
}

function make_deb_package_and_add_to_repo {
  press_enter "=== Press enter to build the package"
  cd $BUILD_DIR
  if [ -f "$1_$VESTA_V.deb" ]; then
    rm $1_$VESTA_V.deb
  fi
  dpkg-deb --build $1_$VESTA_V
  
  if [ $add_deb_to_apt_repo -eq 1 ]; then
    press_enter "=== Press enter to sign the package ==============================================================================="
    
    export GPG_TTY=$(tty)
    dpkg-sig --sign builder $1_$VESTA_V.deb
	mkdir -p $PATH_OF_APT_REPO
    cd $PATH_OF_APT_REPO
    
    press_enter "=== Press enter to add to repo ==============================================================================="
    
    reprepro --ask-passphrase -Vb . remove $DEB_NAME $1
    reprepro --ask-passphrase -Vb . includedeb $DEB_NAME $BUILD_DIR/$1_$VESTA_V.deb
  fi
}

# Install needed software
if [ $run_apt_update_and_install -eq 1 ]; then
  echo "Update system repository..."
  
  apt-get -qq update
  echo "Installing dependencies for compilation..."
  apt-get -qq install -y $SOFTWARE
  
  # Fix for Debian PHP Envroiment
  if [ ! -e /usr/local/include/curl ]; then
      ln -s /usr/include/x86_64-linux-gnu/curl /usr/local/include/curl
  fi
  press_enter "=== Press enter to continue ==============================================================================="
fi


# Set packages to compile
for arg; do
  case "$1" in
    --all)
      NGINX_B='true'
      PHP_B='true'
      VESTA_B='true'
      VESTAGIT_B='true'
	  CWEB_B='true'
	  APTWEB_B='true'
      ;;
    --nginx)
      NGINX_B='true'
      ;;
    --php)
      PHP_B='true'
      ;;
    --vesta)
      VESTA_B='true'
      ;;
    --vestagit)
      VESTAGIT_B='true'
      ;;
    --cweb)
      CWEB_B='true'
      ;;
    --aptweb)
      APTWEB_B='true'
      ;;
    *)
      NOARGUMENT='true'
      ;;
  esac
done

if [ $# -eq 0 ]; then
  echo "!!! Please run with argument --vesta, --nginx, --php, --vestagit, --cweb, --aptweb or --all"
  exit 1
fi

if [ "$CWEB_B" = true ]; then
  VESTAGIT_B='true'
fi
if [ "$VESTA_B" = true ]; then
  VESTAGIT_B='true'
fi

#################################################################################
#
# Get latest vesta from git
#
#################################################################################

if [ "$VESTAGIT_B" = true ]; then
  echo "======= Get latest vesta from git ======="
  cd /root
  rm -rf vesta/
  git clone https://github.com/myvesta/vesta.git
fi

#################################################################################
#
# Building c subdomain web folder
#
#################################################################################

if [ "$CWEB_B" = true ]; then
  echo "======= Building c subdomain web folder ======="
  
  echo "Removing: $PATH_OF_C_WEB_FOLDER"
  rm -rf $PATH_OF_C_WEB_FOLDER
  echo "=== Whole C folder removed"

  echo "=== Making folder $PATH_OF_C_WEB_FOLDER"
  mkdir -p $PATH_OF_C_WEB_FOLDER
  cd $PATH_OF_C_WEB_FOLDER
  
  echo "=== Copying and extracting static files"

  cp /root/vesta/src/static.tar.gz $PATH_OF_C_WEB_FOLDER/static.tar.gz
  tar -xzf static.tar.gz
  rm static.tar.gz
  
  echo "=== Copying files"
  mkdir -p $PATH_OF_C_WEB_FOLDER_FOR_SPECIFIC_DEB_VER
  cp -rf /root/vesta/install/debian/$DEB_VER/* $PATH_OF_C_WEB_FOLDER_FOR_SPECIFIC_DEB_VER
  cp /root/vesta/install/debian/10/deb_signing.key /var/www/c.vesta.hostingpanel.dev/html/deb_signing.key
  cd $PATH_OF_C_WEB_FOLDER_FOR_SPECIFIC_DEB_VER
  
  if [ -f "packages.tar.gz" ]; then
    rm packages.tar.gz
  fi
  tar -czf packages.tar.gz packages/
  
  if [ -f "templates.tar.gz" ]; then
    rm templates.tar.gz
  fi
  tar -czf templates.tar.gz templates/
  
  if [ -f "firewall.tar.gz" ]; then
    rm firewall.tar.gz
  fi
  tar -czf firewall.tar.gz firewall/

  if [ -f "fail2ban.tar.gz" ]; then
    rm fail2ban.tar.gz
  fi
  tar -czf fail2ban.tar.gz fail2ban/

  if [ -f "dovecot.tar.gz" ]; then
    rm dovecot.tar.gz
  fi
  tar -czf dovecot.tar.gz dovecot/
fi

#################################################################################
#
# Building vesta-nginx
#
#################################################################################

if [ "$NGINX_B" = true ]; then
  echo "======= Building vesta-nginx ======="

  echo "=== Change to build directory"
  cd $BUILD_DIR
  
  BUILDING_NOW=0
  # Check if target directory exist
  if [ ! -d "$BUILD_DIR/nginx-$NGINX_V" ] || [ ! -d "$INSTALL_DIR/nginx" ]; then
    BUILDING_NOW=1
    
    press_enter "=== Press enter to download and unpack source files"

	rm -rf nginx-$NGINX_V
	rm -rf openssl-$OPENSSL_V
	rm -rf pcre-$PCRE_V
	rm -rf zlib-$ZLIB_V
    wget -nv -qO- $NGINX | tar xz
    wget -nv -qO- $OPENSSL | tar xz
    wget -nv -qO- $PCRE | tar xz
    wget -nv -qO- $ZLIB | tar xz
    
    echo "=== Change to nginx directory"
    cd nginx-$NGINX_V
    
    press_enter "=== Press enter to configure nginx"
    ./configure 	--prefix=$INSTALL_DIR/nginx \
    		--with-http_ssl_module \
    		--with-openssl=../openssl-$OPENSSL_V \
    		--with-openssl-opt=enable-ec_nistp_64_gcc_128 \
    		--with-openssl-opt=no-nextprotoneg \
    		--with-openssl-opt=no-weak-ssl-ciphers \
    		--with-openssl-opt=no-ssl3 \
    		--with-pcre=../pcre-$PCRE_V \
    	        --with-pcre-jit \
    		--with-zlib=../zlib-$ZLIB_V
    
    # Check install directory and remove if exists
    if [ -d $INSTALL_DIR/nginx ]; then
    	rm -rf $INSTALL_DIR/nginx
    fi
    
    press_enter "=== Press enter to make && make install"
    make && make install

  fi
  
  press_enter "=== Press enter to Prepare Deb Package Folder Structure"
  if [ -d "$BUILD_DIR/vesta-nginx_$VESTA_V" ]; then
    rm -rf $BUILD_DIR/vesta-nginx_$VESTA_V
  fi
  echo "=== Create directory"
  mkdir $BUILD_DIR/vesta-nginx_$VESTA_V

  cd $BUILD_DIR/vesta-nginx_$VESTA_V/
  mkdir -p usr/local/vesta/nginx etc/init.d DEBIAN
  
  press_enter "=== Press enter to Download control, postinst and postrm files"
  # Copying control, postinst and postrm files
  cp -rf /root/vesta/src/deb/nginx/* $BUILD_DIR/vesta-nginx_$VESTA_V/DEBIAN
  rm $BUILD_DIR/vesta-nginx_$VESTA_V/DEBIAN/nginx.conf
  rm $BUILD_DIR/vesta-nginx_$VESTA_V/DEBIAN/vesta
  
  # Set version
  sed -i "/Version: /c\Version: $VESTA_VER" $BUILD_DIR/vesta-nginx_$VESTA_V/DEBIAN/control

  # Set permission
  chmod +x $BUILD_DIR/vesta-nginx_$VESTA_V/DEBIAN/postinst

  echo "=== Copying nginx directory"
  cp -rf $INSTALL_DIR/nginx/* usr/local/vesta/nginx
  
  echo "=== Get Service File"
  cd $BUILD_DIR/vesta-nginx_$VESTA_V/etc/init.d
  cp /root/vesta/src/deb/nginx/vesta vesta
  chmod +x vesta
  
  echo "=== Get nginx.conf"
  cd $BUILD_DIR/vesta-nginx_$VESTA_V
  cp /root/vesta/src/deb/nginx/nginx.conf $BUILD_DIR/vesta-nginx_$VESTA_V/usr/local/vesta/nginx/conf/nginx.conf
  
  # if [ $BUILDING_NOW -eq 1 ]; then
  echo "=== copy binary"
  cp $INSTALL_DIR/nginx/sbin/nginx $BUILD_DIR/vesta-nginx_$VESTA_V/usr/local/vesta/nginx/sbin/vesta-nginx
  # fi
  
  make_deb_package_and_add_to_repo "vesta-nginx"
fi

#################################################################################
#
# Building vesta-php
#
#################################################################################


if [ "$PHP_B" = true ]; then
  echo "======= Building vesta-php package ======="
  cd $BUILD_DIR
  
  BUILDING_NOW=0
  # Check if target directory exist
  if [ ! -d "$BUILD_DIR/php-$PHP_V" ] || [ ! -d "$INSTALL_DIR/nginx" ]; then
	BUILDING_NOW=1
    
    echo "=== Download and unpack source files"
	rm -rf php-$PHP_V
    wget -nv -qO- $PHP | tar xz
    
    echo "=== Change to php directory php-$PHP_V"
    cd php-$PHP_V
    
    press_enter "=== Press enter to continue ==============================================================================="
    
    echo "=== Configure PHP"
    ./configure --prefix=$INSTALL_DIR/php \
                --enable-fpm \
                --with-zlib \
                --with-fpm-user=admin \
                --with-fpm-group=admin \
                --with-mysql \
                --with-mysqli \
                --with-curl \
                --enable-mbstring
    
    # Check install directory and remove if exists
    if [ -d $INSTALL_DIR/php ]; then
    	rm -rf $INSTALL_DIR/php
    fi

    press_enter "=== Press enter to create the files and install them ==============================================================================="
    
    make && make install
    
    press_enter "=== Press enter to continue ==============================================================================="
  fi
  
  cd $BUILD_DIR
  if [ -d "vesta-php_$VESTA_V" ]; then
    rm -rf vesta-php_$VESTA_V
  fi
  echo "=== Create directory: $BUILD_DIR/vesta-php_$VESTA_V"
  mkdir -p $BUILD_DIR/vesta-php_$VESTA_V

  echo "=== Prepare Deb Package Folder Structure: $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta/php and $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN"
  cd $BUILD_DIR/vesta-php_$VESTA_V/
  mkdir -p usr/local/vesta/php DEBIAN
  
  # Copying control, postinst and postrm files
  cp -rf /root/vesta/src/deb/php/* $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN
  rm $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN/php-fpm.conf
  
  # Set version
  sed -i "/Version: /c\Version: $VESTA_VER" $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN/control

  # Set permission
  chmod +x $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN/postinst
 
  press_enter "=== Press enter to copy builded php ==============================================================================="
  cd ..
  
  # if [ $BUILDING_NOW -eq 1 ]; then
  echo "=== Copying php directory"
  cp -rf $INSTALL_DIR/php/* $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta/php/
  press_enter "=== Done, press enter to copy php-fpm.conf and vesta-php binary ==============================================================================="
  # fi

  echo "=== Get php-fpm.conf"
  cp /root/vesta/src/deb/php/php-fpm.conf $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta/php/etc/php-fpm.conf
  
  echo "=== copy binary"
  cp $INSTALL_DIR/php/sbin/php-fpm $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta/php/sbin/vesta-php
  
  make_deb_package_and_add_to_repo "vesta-php"
    
  echo "=== All done"
fi

#################################################################################
#
# Building vesta
#
#################################################################################

if [ "$VESTA_B" = true ]; then
  echo "======= Building vesta package ======="
  # Change to build directory
  cd $BUILD_DIR
  
  # Check if target directory exist
  if [ -d $BUILD_DIR/vesta_$VESTA_V ]; then
  	rm -rf $BUILD_DIR/vesta_$VESTA_V
  fi
  
  # Create directory
  mkdir $BUILD_DIR/vesta_$VESTA_V
  
  # Prepare Deb Package Folder Structure
  cd vesta_$VESTA_V/
  mkdir -p usr/local/vesta DEBIAN
  
  # Copying control, postinst and postrm files
  cp -rf /root/vesta/src/deb/vesta/* $BUILD_DIR/vesta_$VESTA_V/DEBIAN
  
  # Set version
  sed -i "/Version: /c\Version: $VESTA_VER" $BUILD_DIR/vesta_$VESTA_V/DEBIAN/control

  # Set permission
  chmod +x $BUILD_DIR/vesta_$VESTA_V/DEBIAN/postinst
  rm $BUILD_DIR/vesta_$VESTA_V/DEBIAN/conffiles

  # Copying vesta source
  cp -rf /root/vesta/* $BUILD_DIR/vesta_$VESTA_V/usr/local/vesta
  
  # Set permission
  cd $BUILD_DIR/vesta_$VESTA_V/usr/local/vesta/bin
  chmod +x *
  cd $BUILD_DIR/vesta_$VESTA_V/usr/local/vesta/upd
  chmod +x *
  
  make_deb_package_and_add_to_repo "vesta"
fi
