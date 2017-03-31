#!/bin/bash
# info: build script to generate the package
#


USER="root"
NAME="vesta"

cd `dirname $0`
STARTDIR="$(pwd)"
BUILDDIR="$STARTDIR/build"
SOURCEDIR="$STARTDIR/build/source"
REPODIR="$STARTDIR/build/repo"
CONENTDIR="$STARTDIR/build/content"

PACKAGE_SOURCEDIR="$STARTDIR/build/source/$NAME"
PACKAGE_INIT_SCRIPT="$STARTDIR/build/source/$NAME/install/configs/init/$NAME.init"
PACKAGE_INSTALLDIR="/usr/local/$NAME"

PACKAGE_VERSION="0.0.1"
PACKAGE_ITERATION="1"
PACKAGE_EPOCH="1"
PACKAGE_NAME="$NAME"
PACKAGE_VENDOR="Made I.T."
PACKAGE_DESCRIPTION="Webhosting controle panel"

PACKAGE_GIT="git@github.com:madeITBelgium/vesta.git"

NGINX_SOURCEDIR="$STARTDIR/build/nginx-dest/usr/local/$NAME/nginx"
NGINX_INITSCRIPT="$STARTDIR/build/source/$NAME/install/configs/init/$NAME-nginx.init"
NGINX_INSTALLDIR="/usr/local/$NAME/nginx"
NGINX_VERSION="0.0.1"
NGINX_ITERATION="1"
NGINX_EPOCH="1"
NGINX_NAME="$NAME-nginx"
NGINX_VENDOR="Made I.T."
NGINX_DESCRIPTION="Nginx"
nginxVersion="1.11.12"

PHP_SOURCEDIR="$STARTDIR/build/php-dest/usr/local/$NAME/php"
PHP_INSTALLDIR="/usr/local/$NAME/php"
PHP_VERSION="0.0.1"
PHP_ITERATION="1"
PHP_EPOCH="1"
PHP_NAME="$NAME-php"
PHP_VENDOR="Made I.T."
PHP_DESCRIPTION="PHP"
phpVersion="7.1.3"


BUILD_PHP="no"
BUILD_NGINX="no"
BUILD_CORE="no"
INSTALL="no"
INSTALL_GIT="no"
while getopts "h?pnci" opt; do
    case "$opt" in
    h|\?)
        echo "-h help"
        echo "-p Build PHP Default: no"
        echo "-n Build NGINX default: no"
        echo "-c Build core default: no"
        echo "-i Install yum packages default: no"
        echo "-g Install latest git version default :no"
        exit 0
        ;;
    p)  BUILD_PHP="yes"
        ;;
    n)  BUILD_NGINX="yes"
        ;;
    c)  BUILD_CORE="yes"
        ;;
    i)  INSTALL="yes"
        ;;
    g)  INSTALL_GIT="yes"
    esac
done
echo "PHP=$BUILD_PHP NGINX=$BUILD_NGINX CORE=$BUILD_CORE INSTALL=$INSTALL"

#----------------------------------------------------------#
cd $STARTDIR
echo "DELETE OLD BUILD FILES"
rm -rf source content repo.tar php nginx nginx-dest
echo "CREATE DIRECTORY STRUCTURE"
mkdir source
mkdir content

if [ ! -e "repo" ]; then
    mkdir repo
fi
if [ ! -e "repo/i386" ]; then
    mkdir repo/i386
fi
if [ ! -e "repo/noarch" ]; then
    mkdir repo/noarch
fi
if [ ! -e "repo/x86_64" ]; then
    mkdir repo/x86_64
fi

if [ "$INSTALL" = "yes" ]; then
    echo "INSTALL SOFTWARE"
    sudo yum install -y gcc g++ make automake autoconf curl-devel openssl-devel zlib-devel httpd-devel apr-devel apr-util-devel sqlite-devel ruby-rdoc ruby-devel ruby rpm-build createrepo git rubygems 
    sudo yum install -y pcre-devel sshpass gcc-c++
    sudo yum install -y libxml2-devel httpd-devel libXpm-devel gmp-devel libicu-devel t1lib-devel aspell-devel openssl-devel bzip2-devel  libcurl-devel libjpeg-devel libvpx-devel libpng-devel freetype-devel readline-devel libtidy-devel libxslt-devel libmcrypt libmcrypt-devel
    sudo gem install fpm
    echo "INSTALL DONE"
fi

if [ "$INSTALL_GIT" = "yes" ]; then
    echo "FETCH SOURCE"
    cd source
    git clone $PACKAGE_GIT
    cd vesta
    rm -rf .git
    cd ..
else
    echo "COPY SOURCE"
    cd source
    mkdir vesta
    #cp -r ../../* ./vesta/
    rsync -av --progress ../../ ./vesta --exclude build > /dev/null
    cd vesta
    rm -rf .git
    cd ..
fi

chown -R $user:$user *

if [ "$BUILD_CORE" = "yes" ]; then
    echo "START BUILD CORE"
    echo "BUILD NOARCH"
    fpm -s dir -t rpm -n "$PACKAGE_NAME" -v "$PACKAGE_VERSION" --iteration "$PACKAGE_ITERATION" -a all -C "$PACKAGE_SOURCEDIR" --prefix "$PACKAGE_INSTALLDIR" --epoch "$PACKAGE_EPOCH" --license GPL --vendor "$PACKAGE_VENDOR" --description "$PACKAGE_DESCRIPTION" --rpm-init "$PACKAGE_INIT_SCRIPT" -d "$NAME-php" --after-install $PACKAGE_SOURCEDIR/upd/afterInstall.sh --after-upgrade $PACKAGE_SOURCEDIR/upd/afterupdate.sh
    FILENAME=$(echo "$PACKAGE_NAME-$PACKAGE_VERSION-$PACKAGE_ITERATION.noarch.rpm")
    mv $FILENAME $REPODIR/noarch/$FILENAME

    echo "BUILD I386"
    fpm -s dir -t rpm -n "$PACKAGE_NAME" -v "$PACKAGE_VERSION" --iteration "$PACKAGE_ITERATION" -a i386 -C "$PACKAGE_SOURCEDIR" --prefix "$PACKAGE_INSTALLDIR" --epoch "$PACKAGE_EPOCH" --license GPL --vendor "$PACKAGE_VENDOR" --description "$PACKAGE_DESCRIPTION" --rpm-init "$PACKAGE_INIT_SCRIPT" -d "$NAME-php" --after-install $PACKAGE_SOURCEDIR/upd/afterInstall.sh --after-upgrade $PACKAGE_SOURCEDIR/upd/afterupdate.sh
    FILENAME=$(echo "$PACKAGE_NAME-$PACKAGE_VERSION-$PACKAGE_ITERATION.i386.rpm")
    mv $FILENAME $REPODIR/i386/$FILENAME

    echo "BUILD x86_64"
    fpm -s dir -t rpm -n "$PACKAGE_NAME" -v "$PACKAGE_VERSION" --iteration "$PACKAGE_ITERATION" -a x86_64 -C "$PACKAGE_SOURCEDIR" --prefix "$PACKAGE_INSTALLDIR" --epoch "$PACKAGE_EPOCH" --license GPL --vendor "$PACKAGE_VENDOR" --description "$PACKAGE_DESCRIPTION" --rpm-init "$PACKAGE_INIT_SCRIPT" -d "$NAME-php" --after-install $PACKAGE_SOURCEDIR/upd/afterInstall.sh --after-upgrade $PACKAGE_SOURCEDIR/upd/afterupdate.sh
    FILENAME=$(echo "$PACKAGE_NAME-$PACKAGE_VERSION-$PACKAGE_ITERATION.x86_64.rpm")
    mv $FILENAME $REPODIR/x86_64/$FILENAME
    echo "BUILD CORE DONE"
fi

#------------------------ BUILD NGINX
cd $STARTDIR

if [ "$BUILD_NGINX" = "yes" ]; then
    wget http://nginx.org/download/nginx-$nginxVersion.tar.gz
    tar -xzf nginx-$nginxVersion.tar.gz 
    rm -rf nginx-$nginxVersion.tar.gz
    mv nginx-$nginxVersion nginx

    cd nginx

    ./configure \
    --user=nginx                                                \
    --group=nginx                                               \
    --prefix=$NGINX_INSTALLDIR                                  \
    --sbin-path=$NGINX_INSTALLDIR/sbin/$NAME-nginx              \
    --conf-path=$NGINX_INSTALLDIR/nginx.conf                    \
    --pid-path=/usr/local/$NAME/nginx/var/run/$NAME-nginx.pid   \
    --lock-path=/usr/local/$NAME/nginx/var/run/$NAME-nginx.lock \
    --error-log-path=/usr/local/$NAME/log/nginx-error.log       \
    --http-log-path=/usr/local/$NAME/log/nginx-access.log       \
    --with-http_ssl_module  > /dev/null

    make install DESTDIR=$STARTDIR/nginx-dest INSTALLDIRS=vendor > /dev/null
    cp $PACKAGE_SOURCEDIR/install/configs/init/nginx/nginx.conf $STARTDIR/nginx-dest/usr/local/$NAME/nginx/nginx.conf
    cp $PACKAGE_SOURCEDIR/install/configs/init/nginx/nginx.unit $STARTDIR/nginx-dest/usr/local/$NAME/nginx/$NAME-nginx.service
    cp $PACKAGE_SOURCEDIR/install/configs/init/nginx/install.sh $STARTDIR/nginx-dest/usr/local/$NAME/nginx/install.sh
    cd ..
    echo "START BUILD RPM"
    echo "BUILD NOARCH"
    fpm -s dir -t rpm -n "$NGINX_NAME" -v "$NGINX_VERSION" --iteration "$NGINX_ITERATION" -a all -C "$NGINX_SOURCEDIR" --prefix "$NGINX_INSTALLDIR" --epoch "$NGINX_EPOCH" --license GPL --vendor "$NGINX_VENDOR" --description "$NGINX_DESCRIPTION" --rpm-init "$NGINX_INITSCRIPT" --after-install $PACKAGE_SOURCEDIR/install/configs/init/nginx/install.sh
    FILENAME=$(echo "$NGINX_NAME-$NGINX_VERSION-$NGINX_ITERATION.noarch.rpm")
    mv $FILENAME $REPODIR/noarch/$FILENAME

    echo "BUILD I386"
    fpm -s dir -t rpm -n "$NGINX_NAME" -v "$NGINX_VERSION" --iteration "$NGINX_ITERATION" -a i386 -C "$NGINX_SOURCEDIR" --prefix "$NGINX_INSTALLDIR" --epoch "$NGINX_EPOCH" --license GPL --vendor "$NGINX_VENDOR" --description "$NGINX_DESCRIPTION" --rpm-init "$NGINX_INITSCRIPT" --after-install $PACKAGE_SOURCEDIR/install/configs/init/nginx/install.sh
    FILENAME=$(echo "$NGINX_NAME-$NGINX_VERSION-$NGINX_ITERATION.i386.rpm")
    mv $FILENAME $REPODIR/i386/$FILENAME

    echo "BUILD x86_64"
    fpm -s dir -t rpm -n "$NGINX_NAME" -v "$NGINX_VERSION" --iteration "$NGINX_ITERATION" -a x86_64 -C "$NGINX_SOURCEDIR" --prefix "$NGINX_INSTALLDIR" --epoch "$NGINX_EPOCH" --license GPL --vendor "$NGINX_VENDOR" --description "$NGINX_DESCRIPTION" --rpm-init "$NGINX_INITSCRIPT" --after-install $PACKAGE_SOURCEDIR/install/configs/init/nginx/install.sh
    FILENAME=$(echo "$NGINX_NAME-$NGINX_VERSION-$NGINX_ITERATION.x86_64.rpm")
    mv $FILENAME $REPODIR/x86_64/$FILENAME

    chown -R $USER:$USER $REPODIR
fi

#------------------------------------------------------------------------ PHP
cd $STARTDIR

if [ "$BUILD_PHP" = "yes" ]; then
    wget -O php-$phpVersion.tar.gz http://be2.php.net/get/php-$phpVersion.tar.gz/from/this/mirror
    tar -xvf php-$phpVersion.tar.gz
    mv php-$phpVersion php
    rm -rf php-$phpVersion.tar.gz

    cd php
    ./configure --prefix=$PHP_INSTALLDIR --bindir=$PHP_INSTALLDIR/bin --exec-prefix=$PHP_INSTALLDIR --enable-fpm --with-fpm-user=admin --with-fpm-group=admin --with-mcrypt --with-mhash --enable-mbstring --with-curl --with-openssl --with-xmlrpc --enable-soap --enable-zip --with-gd --with-jpeg-dir --with-png-dir --with-freetype-dir --enable-intl --with-config-file-scan-dir=$PHP_INSTALLDIR
    make install INSTALL_ROOT="$STARTDIR/php-dest"  > /dev/null
    
    cp $PACKAGE_SOURCEDIR/install/configs/init/php.ini $STARTDIR/php-dest/usr/local/$NAME/php/php.ini
    cp $PACKAGE_SOURCEDIR/install/configs/init/php-fpm.conf $STARTDIR/php-dest/usr/local/$NAME/php/etc/php-fpm.conf
    cp $PACKAGE_SOURCEDIR/install/configs/init/php-fpm.conf $STARTDIR/php-dest/usr/local/$NAME/php/php-fpm.conf
    
    cd ..
    echo "START BUILD RPM"
    echo "BUILD NOARCH"
    fpm -s dir -t rpm -n "$PHP_NAME" -v "$PHP_VERSION" --iteration "$PHP_ITERATION" -a all -C "$PHP_SOURCEDIR" --prefix "$PHP_INSTALLDIR" --epoch "$PHP_EPOCH" --license GPL --vendor "$PHP_VENDOR" --description "$PHP_DESCRIPTION" -d openssl -d pcre -d bzip2 -d curl -d libjpeg -d libpng -d freetype -d gmp -d libmcrypt -d libmhash -d libxml2
    FILENAME=$(echo "$PHP_NAME-$PHP_VERSION-$PHP_ITERATION.noarch.rpm")
    mv $FILENAME $REPODIR/noarch/$FILENAME

    echo "BUILD I386"
    fpm -s dir -t rpm -n "$PHP_NAME" -v "$PHP_VERSION" --iteration "$PHP_ITERATION" -a i386 -C "$PHP_SOURCEDIR" --prefix "$PHP_INSTALLDIR" --epoch "$PHP_EPOCH" --license GPL --vendor "$PHP_VENDOR" --description "$PHP_DESCRIPTION" -d openssl -d pcre -d bzip2 -d curl -d libjpeg -d libpng -d freetype -d gmp -d libmcrypt -d libmhash -d libxml2
    FILENAME=$(echo "$PHP_NAME-$PHP_VERSION-$PHP_ITERATION.i386.rpm")
    mv $FILENAME $REPODIR/i386/$FILENAME

    echo "BUILD x86_64"
    fpm -s dir -t rpm -n "$PHP_NAME" -v "$PHP_VERSION" --iteration "$PHP_ITERATION" -a x86_64 -C "$PHP_SOURCEDIR" --prefix "$PHP_INSTALLDIR" --epoch "$PHP_EPOCH" --license GPL --vendor "$PHP_VENDOR" --description "$PHP_DESCRIPTION" -d openssl -d pcre -d bzip2 -d curl -d libjpeg -d libpng -d freetype -d gmp -d libmcrypt -d libmhash -d libxml2
    FILENAME=$(echo "$PHP_NAME-$PHP_VERSION-$PHP_ITERATION.x86_64.rpm")
    mv $FILENAME $REPODIR/x86_64/$FILENAME

    chown -R $USER:$USER $REPODIR
fi


cd $STARTDIR/repo
echo "CREATE REPO"
for arch in i386 x86_64 noarch
do
    pushd ${REPODIR}/${arch} >/dev/null 2>&1
    createrepo -d .
    popd >/dev/null 2>&1
done
echo "DONE BUILD RPM"
cd $STARTDIR


if [ "$BUILD_CORE" = "yes" ]; then
    echo "ZIP CONTENT"

    cd $PACKAGE_SOURCEDIR/install/configs
    for dir in $(ls)
    do
        tar -cvzf "$CONENTDIR/$dir.tar.gz" "$dir" > /dev/null
        cp -R "$dir" $CONENTDIR > /dev/null
    done
fi
cd $STARTDIR
chown -R $user:$user *


tar -cpf repo.tar repo
tar -cpf content.tar content
#rm -rf source content php nginx composer.phar nginx-dest

#echo "BUILD DEB"
#fpm -s dir -t deb -n "$NAME" -v "$VERSION" --iteration "$ITERATION" -a all -C "$SOURCEDIR" --prefix "$INSTALLDIR" --epoch "$EPOCH" --license GPL --vendor "$VENDOR" --description "$DESCRIPTION"

#http://davehall.com.au/blog/dave/2010/02/06/howto-setup-private-package-repository-reprepro-nginx