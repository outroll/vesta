#!/bin/bash

cd `dirname $0`
STARTDIR="$(pwd)"

git clone https://github.com/madeITBelgium/vesta.git

VESTASOURCEDIR="$STARTDIR/vesta"
VESTADIR="/usr/local/vesta"


service vesta stop

mkdir -p VESTASOURCEDIR/conf VESTASOURCEDIR/data VESTASOURCEDIR/log VESTASOURCEDIR/nginx VESTASOURCEDIR/php VESTASOURCEDIR/ssl

cp -r $VESTADIR/conf $VESTASOURCEDIR/conf
cp -r $VESTADIR/data $VESTASOURCEDIR/data
cp -r $VESTADIR/log $VESTASOURCEDIR/log
cp -r $VESTADIR/nginx $VESTASOURCEDIR/nginx
cp -r $VESTADIR/php $VESTASOURCEDIR/php
cp -r $VESTADIR/ssl $VESTASOURCEDIR/ssl

rm -rf $VESTADIR
mv -f $VESTASOURCEDIR $VESTADIR