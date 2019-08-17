#!/bin/bash

# Autocompile Script for VestaCP deb files - ver 1.0
# Made for MyVesta fork.
# Autocompile script borrowed from HestiaCP, special thanks to Raphael Schneeberger

build_deb_package=1
add_deb_to_apt_repo=0

TARGET_DEB_NAME='buster'
TARGET_DEB_VER='10'
VESTA_VER='0.9.8-25'

run_apt_update_and_install=1
wait_to_press_enter=1

###############
# Note: first run --apt before turning add_deb_to_apt_repo=1

if [ $# -gt 1 ]; then
    TARGET_DEB_NAME=$2
fi

if [ $# -gt 2 ]; then
    TARGET_DEB_VER=$3
fi

MAINTAINER_EMAIL='predrag@hostingpanel.dev'

TARGET_DEB_NAME_MAIN='buster'
TARGET_DEB_VER_MAIN='10'

# Set compiling directory
BUILD_DIR="/usr/src/$TARGET_DEB_NAME"
BUILD_DIR_MAIN="/usr/src/$TARGET_DEB_NAME_MAIN"
INSTALL_DIR="/usr/local/vesta"

# Set git repository raw path
GIT_SRC='https://raw.githubusercontent.com/myvesta/vesta/master/src'
GIT_REP="$GIT_REP/deb"

C_WEB_ADDRESS="c.vesta.hostingpanel.dev"
PATH_OF_C_WEB_FOLDER_ROOT="/var/www/$C_WEB_ADDRESS/html"
PATH_OF_C_WEB_FOLDER="$PATH_OF_C_WEB_FOLDER_ROOT/debian/$TARGET_DEB_VER"
APT_WEB_ADDRESS="apt.vesta.hostingpanel.dev"
PATH_OF_APT_REPO_ROOT="/var/www/$APT_WEB_ADDRESS/html"
PATH_OF_APT_REPO="$PATH_OF_APT_REPO_ROOT/$TARGET_DEB_NAME"

# Set Version for compiling
VESTA_V=$VESTA_VER"_amd64"
NGINX_V='1.17.3'
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
SOFTWARE='build-essential libxml2-dev libz-dev libcurl4-gnutls-dev unzip openssl libssl-dev pkg-config reprepro dpkg-sig git'

function press_enter {
    if [ $wait_to_press_enter -eq 1 ]; then
        read -p "$1"
    else
        echo $1
    fi
}

function make_deb_package {
  press_enter "=== Press enter to build the package"
  cd $BUILD_DIR
  if [ -f "$1_$VESTA_V.deb" ]; then
    rm $1_$VESTA_V.deb
  fi
  dpkg-deb --build $1_$VESTA_V
  echo "=== Building done."
  echo "=== Your .deb package is here: $BUILD_DIR/$1_$VESTA_V.deb"
}

function add_to_repo {  
  press_enter "=== Press enter to sign the package ==============================================================================="
  cd $BUILD_DIR
  export GPG_TTY=$(tty)
  dpkg-sig --sign builder $1_$VESTA_V.deb
  
  press_enter "=== Press enter to add to repo ==============================================================================="
    
  mkdir -p $PATH_OF_APT_REPO
  cd $PATH_OF_APT_REPO
  echo "=== cd $PATH_OF_APT_REPO"
  reprepro --ask-passphrase -Vb . remove $TARGET_DEB_NAME $1
  reprepro --ask-passphrase -Vb . includedeb $TARGET_DEB_NAME $BUILD_DIR/$1_$VESTA_V.deb
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
    --git)
      VESTAGIT_B='true'
      ;;
    --c)
      CWEB_B='true'
      ;;
    --apt)
      APTWEB_B='true'
      ;;
    *)
      NOARGUMENT='true'
      ;;
  esac
done

if [ $# -eq 0 ]; then
  echo "!!! Please run with argument --vesta, --nginx, --php, --git, --c, --apt or --all"
  exit 1
fi

if [ $build_deb_package -eq 1 ]; then
  if [ "$APTWEB_B" = true ]; then
    VESTAGIT_B='true'
  fi
  if [ "$CWEB_B" = true ]; then
    VESTAGIT_B='true'
  fi
  if [ "$VESTA_B" = true ]; then
    VESTAGIT_B='true'
  fi
  if [ "$PHP_B" = true ]; then
    VESTAGIT_B='true'
  fi
  if [ "$NGINX_B" = true ]; then
    VESTAGIT_B='true'
  fi
fi

if [ ! -d "$BUILD_DIR" ]; then
  mkdir -p $BUILD_DIR
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
  echo "=== Git cloning done"
fi

#################################################################################
#
# Building c subdomain web folder
#
#################################################################################

if [ "$APTWEB_B" = true ]; then
  echo "======= Building apt subdomain web folder ======="

  mkdir -p $PATH_OF_APT_REPO
  cd $PATH_OF_APT_REPO
  
  mkdir conf && cd conf
  cat <<EOF >distributions
Origin: $APT_WEB_ADDRESS
Label: myvesta apt repository
Codename: $TARGET_DEB_NAME
Architectures: amd64 source
Components: vesta
Description: myvesta debian package repo
SignWith: yes
Pull: $TARGET_DEB_NAME
EOF
  
  if [ ! -d "/root/.gnupg" ]; then
    gpg --gen-key
    gpg --armor --export $MAINTAINER_EMAIL --output $MAINTAINER_EMAIL.gpg.key
    press_enter "*** please copy above generated key to your clipboard and then paste it after pressing enter now ***"
    vi $PATH_OF_APT_REPO_ROOT/deb_signing.key
    cp $PATH_OF_APT_REPO_ROOT/deb_signing.key $PATH_OF_C_WEB_FOLDER_ROOT/deb_signing.key
  fi

  echo "=== All done"
fi
 
#################################################################################
#
# Building c subdomain web folder
#
#################################################################################

if [ "$CWEB_B" = true ]; then
  echo "======= Building c subdomain web folder ======="
  
  echo "Removing: $PATH_OF_C_WEB_FOLDER_ROOT"
  rm -rf $PATH_OF_C_WEB_FOLDER_ROOT
  echo "=== Whole C folder removed"

  echo "=== Making folder $PATH_OF_C_WEB_FOLDER_ROOT"
  mkdir -p $PATH_OF_C_WEB_FOLDER_ROOT
  cd $PATH_OF_C_WEB_FOLDER_ROOT
  
  echo "=== Copying and extracting static files"

  cp /root/vesta/src/static.tar.gz $PATH_OF_C_WEB_FOLDER_ROOT/static.tar.gz
  tar -xzf static.tar.gz
  rm static.tar.gz
  
  echo "=== Copying files"
  mkdir -p $PATH_OF_C_WEB_FOLDER
  cp -rf /root/vesta/install/debian/* $PATH_OF_C_WEB_FOLDER_ROOT/debian
  if [ ! -f "$PATH_OF_C_WEB_FOLDER_ROOT/deb_signing.key" ]; then
    cp /root/vesta/install/debian/$TARGET_DEB_VER_MAIN/deb_signing.key $PATH_OF_C_WEB_FOLDER_ROOT/deb_signing.key
  fi
  cd $PATH_OF_C_WEB_FOLDER
  
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
  echo "=== All done"
  
  cp /root/vesta/install/vst-install-debian.sh $PATH_OF_C_WEB_FOLDER_ROOT/vst-install-debian.sh
fi

#################################################################################
#
# Building vesta-nginx
#
#################################################################################

if [ "$NGINX_B" = true ]; then
  if [ $build_deb_package -eq 1 ]; then
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
    
    make_deb_package "vesta-nginx"
  fi
  if [ $add_deb_to_apt_repo -eq 1 ]; then
    add_to_repo "vesta-nginx"
  fi

  echo "=== All done"
fi

#################################################################################
#
# Building vesta-php
#
#################################################################################


if [ "$PHP_B" = true ]; then
  if [ $build_deb_package -eq 1 ]; then
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
    rm $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN/php.ini
    
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
    cp /root/vesta/src/deb/php/php.ini $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta/php/lib/php.ini
    
    echo "=== copy binary"
    cp $INSTALL_DIR/php/sbin/php-fpm $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta/php/sbin/vesta-php
  
    make_deb_package "vesta-php"
  fi
  if [ $add_deb_to_apt_repo -eq 1 ]; then
    add_to_repo "vesta-php"
  fi
    
  echo "=== All done"
fi

#################################################################################
#
# Building vesta
#
#################################################################################

if [ "$VESTA_B" = true ]; then
  if [ $build_deb_package -eq 1 ]; then
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
    
    make_deb_package "vesta"
  fi
  if [ $add_deb_to_apt_repo -eq 1 ]; then
    if [ "$TARGET_DEB_NAME_MAIN" != "$TARGET_DEB_NAME" ]; then
      cd $BUILD_DIR
	  if [ -f "vesta_$VESTA_V.deb" ]; then
        rm vesta_$VESTA_V.deb
	  fi
      cp $BUILD_DIR_MAIN/vesta_$VESTA_V.deb $BUILD_DIR/vesta_$VESTA_V.deb
	fi
    add_to_repo "vesta"
  fi

  echo "=== All done"
fi
