#!/bin/bash

# Autocompile Script for VestaCP deb Files.
# Made for MyVesta fork.
# Autocompile script borrowed from HestiaCP, special thanks to Raphael Schneeberger

wait_to_press_enter=1
run_apt_update_and_install=1
add_deb_to_apt_repo=0

function press_enter {
    if [ $wait_to_prss_enter -eq 1 ]; then
        read -p "$1"
    else
        echo $1
    fi
}

# Set compiling directory
BUILD_DIR='/usr/src'
INSTALL_DIR='/usr/local/vesta'

# Set git repository raw path
GIT_REP='https://raw.githubusercontent.com/myvesta/vesta/master/src/deb'

PATH_OF_APT_REPO='/var/www/html/buster'

# Set Version for compiling
VESTA_V='0.9.8-24_amd64'
NGINX_V='1.17.1'
OPENSSL_V='1.1.1c'
PCRE_V='8.43'
ZLIB_V='1.2.11'
PHP_V='5.6.40'

# Generate Links for sourcecode
VESTA='https://github.com/myvesta/vesta/archive/master.zip'
NGINX='https://nginx.org/download/nginx-'$NGINX_V'.tar.gz'
OPENSSL='https://www.openssl.org/source/openssl-'$OPENSSL_V'.tar.gz'
PCRE='https://ftp.pcre.org/pub/pcre/pcre-'$PCRE_V'.tar.gz'
ZLIB='https://www.zlib.net/zlib-'$ZLIB_V'.tar.gz'
PHP='http://de2.php.net/distributions/php-'$PHP_V'.tar.gz'

# Set package dependencies for compiling
SOFTWARE='build-essential libxml2-dev libz-dev libcurl4-gnutls-dev unzip openssl libssl-dev pkg-config'

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
    *)
      NOARGUMENT='true'
      ;;
  esac
done

if [[ $# -eq 0 ]] ; then
  echo "!!! Please run with argument --all, --vesta, --nginx or --php !!!"
  exit 1
fi


#################################################################################
#
# Building vesta-nginx
#
#################################################################################

if [ "$NGINX_B" = true ] ; then
  echo "======= Building vesta-nginx ======="

  echo "=== Change to build directory"
  cd $BUILD_DIR
  
  BUILDING_NOW=0
  # Check if target directory exist
  if [ ! -d $BUILD_DIR/vesta-nginx_$VESTA_V ]; then
  	#mv $BUILD_DIR/vesta-nginx_$VESTA_V $BUILD_DIR/vesta-nginx_$VESTA_V-$(timestamp)
  	# rm -r $BUILD_DIR/vesta-nginx_$VESTA_V
    # fi
  
    BUILDING_NOW=1
    echo "=== Create directory"
    mkdir $BUILD_DIR/vesta-nginx_$VESTA_V
    
    press_enter "=== Download and unpack source files"
    wget -nv -qO- $NGINX | tar xz
    wget -nv -qO- $OPENSSL | tar xz
    wget -nv -qO- $PCRE | tar xz
    wget -nv -qO- $ZLIB | tar xz
    
    echo "=== Change to nginx directory"
    cd nginx-$NGINX_V
    
    press_enter "=== Press enter to configure nginx"
    ./configure 	--prefix=/usr/local/vesta/nginx \
    		--with-http_ssl_module \
    		--with-openssl=../openssl-$OPENSSL_V \
    		--with-openssl-opt=enable-ec_nistp_64_gcc_128 \
    		--with-openssl-opt=no-nextprotoneg \
    		--with-openssl-opt=no-weak-ssl-ciphers \
    		--with-openssl-opt=no-ssl3 \
    		--with-pcre=../pcre-$PCRE_V \
    	        --with-pcre-jit \
    		--with-zlib=../zlib-$ZLIB_V
    
    # Check install directory and move if exists
    if [ -d $INSTALL_DIR ]; then
    	#mv $INSTALL_DIR $INSTALL_DIR$(timestamp)
    	rm -r $INSTALL_DIR
    fi
    
    press_enter "=== Press enter to make && make install"
    make && make install
    
    press_enter "=== Press enter to clear up unused files"
    cd $BUILD_DIR
    rm -r nginx-$NGINX_V openssl-$OPENSSL_V pcre-$PCRE_V zlib-$ZLIB_V
  fi
  
  press_enter "=== Press enter to Prepare Deb Package Folder Structure"
  cd vesta-nginx_$VESTA_V/
  mkdir -p usr/local/vesta etc/init.d DEBIAN
  
  press_enter "=== Press enter to Download control, postinst and postrm files"
  cd DEBIAN
  wget -nv $GIT_REP/nginx/control -O control
  wget -nv $GIT_REP/nginx/copyright -O copyright
  wget -nv $GIT_REP/nginx/postinst -O postinst
  wget -nv $GIT_REP/nginx/postrm -O postrm
  chmod +x postinst postrm
  
  cd ..
  if [ $BUILDING_NOW -eq 1 ]; then
    echo "=== Move nginx directory"
    mv /usr/local/vesta/nginx usr/local/vesta/
  fi
  
  echo "=== Get Service File"
  cd etc/init.d
  wget -nv $GIT_REP/nginx/vesta
  chmod +x vesta
  
  echo "=== Get nginx.conf"
  cd ../../
  wget -nv $GIT_REP/nginx/nginx.conf -O usr/local/vesta/nginx/conf/nginx.conf
  
  if [ $BUILDING_NOW -eq 1 ]; then
    echo "=== copy binary"
    cp usr/local/vesta/nginx/sbin/nginx usr/local/vesta/nginx/sbin/vesta-nginx
  fi
  
  press_enter "=== Press enter to build the package"
  cd /usr/src
  dpkg-deb --build vesta-nginx_$VESTA_V
    
  if [ $add_deb_to_apt_repo -eq 1 ]; then
    press_enter "=== Press enter to sign the package ==============================================================================="
    
    export GPG_TTY=$(tty)
    dpkg-sig --sign builder vesta-nginx_$VESTA_V.deb
    cd $PATH_OF_APT_REPO
    
    press_enter "=== Press enter to add to repo ==============================================================================="
    
    reprepro --ask-passphrase -Vb . remove buster vesta-nginx
    reprepro --ask-passphrase -Vb . includedeb buster $BUILD_DIR/vesta-nginx_$VESTA_V.deb
  fi

  # clear up the source folder
  # rm -r vesta-nginx_$VESTA_V
fi

#################################################################################
#
# Building vesta-php
#
#################################################################################


if [ "$PHP_B" = true ] ; then
  echo "======= Building vesta-php ======="
  echo "=== Change to build directory: $BUILD_DIR"
  cd $BUILD_DIR
  
  BUILDING_NOW=0
  # Check if target directory exist
  if [ ! -d $BUILD_DIR/vesta-php_$VESTA_V ]; then
      # #mv $BUILD_DIR/vesta-php_$VESTA_V $BUILD_DIR/vesta-php_$VESTA_V-$(timestamp)
  	  # rm -r $BUILD_DIR/vesta-php_$VESTA_V
    # fi
	BUILDING_NOW=1
    
    echo "=== Create directory: $BUILD_DIR/vesta-php_$VESTA_V"
    mkdir $BUILD_DIR/vesta-php_$VESTA_V
    
    echo "=== Download and unpack source files"
    wget -nv -qO- $PHP | tar xz
    
    echo "=== Change to php directory php-$PHP_V"
    cd php-$PHP_V
    
    press_enter "=== Press enter to continue ==============================================================================="
    
    echo "=== Configure PHP"
    ./configure --prefix=/usr/local/vesta/php \
                --enable-fpm \
                --with-zlib \
                --with-fpm-user=admin \
                --with-fpm-group=admin \
                --with-mysql \
                --with-mysqli \
                --with-curl \
                --enable-mbstring
    
    press_enter "=== Press enter to Create the files and install them ==============================================================================="
    
    make && make install
    
    press_enter "=== Press enter to continue ==============================================================================="
    
    echo "=== Clear up unused files: $BUILD_DIR/php-$PHP_V"
    cd $BUILD_DIR
    rm -r php-$PHP_V
  fi
  
  echo "=== Prepare Deb Package Folder Structure: $BUILD_DIR/vesta-php_$VESTA_V/usr/local/vesta and $BUILD_DIR/vesta-php_$VESTA_V/DEBIAN"
  cd vesta-php_$VESTA_V/
  mkdir -p usr/local/vesta/php DEBIAN
  
  echo "=== Download control, postinst and postrm files"
  cd DEBIAN
  wget -nv $GIT_REP/php/postinst -O postinst
  chmod 0755 postinst
  wget -nv $GIT_REP/php/control -O control
  wget -nv $GIT_REP/php/copyright -O copyright
 
  press_enter "=== Press enter to move php directory ==============================================================================="
  cd ..
  
  if [ $BUILDING_NOW -eq 1 ]; then
    echo "=== Moving php directory"
    mv /usr/local/vesta/php usr/local/vesta/
    press_enter "=== Done, press enter ==============================================================================="
  fi

  echo "=== Get php-fpm.conf"
  wget -nv $GIT_REP/php/php-fpm.conf -O usr/local/vesta/php/etc/php-fpm.conf
  
  if [ $BUILDING_NOW -eq 1 ]; then
    echo "=== copy binary"
    cp usr/local/vesta/php/sbin/php-fpm usr/local/vesta/php/sbin/vesta-php
  fi
  
  press_enter "=== Press enter to build the package ==============================================================================="

  echo "=== build the package"
  cd /usr/src
  if [ -f "vesta-php_$VESTA_V.deb" ]; then
    rm vesta-php_$VESTA_V.deb
  fi
  dpkg-deb --build vesta-php_$VESTA_V
  
  if [ $add_deb_to_apt_repo -eq 1 ]; then
    press_enter "=== Press enter to sign the package ==============================================================================="
    
    export GPG_TTY=$(tty)
    dpkg-sig --sign builder vesta-php_$VESTA_V.deb
    
    press_enter "=== Press enter to add to repo ==============================================================================="
    
    cd $PATH_OF_APT_REPO
    reprepro --ask-passphrase -Vb . remove buster vesta-php
    reprepro --ask-passphrase -Vb . includedeb buster $BUILD_DIR/vesta-php_$VESTA_V.deb
  fi

  # clear up the source folder
  # rm -r vesta-php_$VESTA_V
  
  echo "=== All done"
fi

#################################################################################
#
# Building vesta
#
#################################################################################

if [ "$VESTA_B" = true ] ; then
  # Change to build directory
  cd $BUILD_DIR
  
  # Check if target directory exist
  if [ -d $BUILD_DIR/vesta_$VESTA_V ]; then
  	rm -r $BUILD_DIR/vesta_$VESTA_V
  fi
  if [ -d $BUILD_DIR/vesta-master ]; then
  	rm -r $BUILD_DIR/vesta-master
  fi
  
  # Create directory
  mkdir $BUILD_DIR/vesta_$VESTA_V
  
  # Download and unpack source files
  wget -nv $VESTA
  unzip -q master.zip
  rm master.zip
  
  # Prepare Deb Package Folder Structure
  cd vesta_$VESTA_V/
  mkdir -p usr/local/vesta DEBIAN
  
  # Download control, postinst and postrm files
  cd DEBIAN
  wget -nv $GIT_REP/vesta/control
  wget -nv $GIT_REP/vesta/copyright
  wget -nv $GIT_REP/vesta/postinst
  
  # Set permission
  chmod +x postinst
 
  # Move needed directories
  cd $BUILD_DIR/vesta-master
  mv bin func install upd web $BUILD_DIR/vesta_$VESTA_V/usr/local/vesta/
   
  # Set permission
  cd $BUILD_DIR/vesta_$VESTA_V/usr/local/vesta/bin
  chmod +x *
  
  press_enter "=== Press enter to build the package ==============================================================================="
  # build the package
  cd /usr/src
  dpkg-deb --build vesta_$VESTA_V

  if [ $add_deb_to_apt_repo -eq 1 ]; then
    press_enter "=== Press enter to sign the package ==============================================================================="
    
    export GPG_TTY=$(tty)
    dpkg-sig --sign builder vesta_$VESTA_V.deb
    
    press_enter "=== Press enter to add to repo ==============================================================================="
    
    cd $PATH_OF_APT_REPO
    reprepro --ask-passphrase -Vb . remove buster vesta
    reprepro --ask-passphrase -Vb . includedeb buster $BUILD_DIR/vesta_$VESTA_V.deb
  fi
  
  # clear up the source folder
  cd /usr/src
  rm -r vesta_$VESTA_V
  rm -r vesta-master
fi
