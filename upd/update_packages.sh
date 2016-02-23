#!/bin/bash
start="/usr/local/vesta/data/templates"
if [ -d "$start/web/apache2" ]; then
	startPath="$start/web/apache2"
fi
if [ -d "$start/web/httpd" ]; then
	startPath="$start/web/httpd"
fi
mkdir $startPath/ipv4
mkdir $startPath/ipv4ipv6
mkdir $startPath/ipv6
for f in $startPath/*tpl
do
	echo "Process file $f"
  file=$(echo $f | cut -f 9 -d / | cut -f 1 -d .)
  extension=$(echo $f | cut -f 9 -d / | cut -f 2 -d .)
	pathA="$startPath/ipv4/$file.$extension"
	pathB="$startPath/ipv6/$file.$extension"
	pathC="$startPath/ipv4ipv6/$file.$extension"
	
	mv "$startPath/$file.$extension" "$pathA"
	
	cp "$pathA" "$pathB"
	sed -i "s/%ip%/[%ipv6%]/g" "$pathB"
	cat "$pathA" > "$pathC"
	cat "$pathB" >> "$pathC"
done
for f in $startPath/*sh
do
	echo "Process file $f"
  file=$(echo $f | cut -f 9 -d / | cut -f 1 -d .)
  extension=$(echo $f | cut -f 9 -d / | cut -f 2 -d .)
	pathA="$startPath/ipv4/$file.$extension"
	pathB="$startPath/ipv6/$file.$extension"
	pathC="$startPath/ipv4ipv6/$file.$extension"
	
	mv "$startPath/$file.$extension" "$pathA"
	
	cp "$pathA" "$pathB"
	cp "$pathA" "$pathC"
done

startPath="$start/web/nginx"
mkdir $startPath/ipv4
mkdir $startPath/ipv4ipv6
mkdir $startPath/ipv6
for f in $startPath/*tpl
do
	if [ "$f" != "$startPath/proxy_ip.tpl" ]; then
		echo "Process file $f"
		file=$(echo $f | cut -f 9 -d / | cut -f 1 -d .)
		extension=$(echo $f | cut -f 9 -d / | cut -f 2 -d .)
		pathA="$startPath/ipv4/$file.$extension"
		pathB="$startPath/ipv6/$file.$extension"
		pathC="$startPath/ipv4ipv6/$file.$extension"

		mv "$startPath/$file.$extension" "$pathA"

		cp "$pathA" "$pathB"
		sed -i "s/%ip%/[%ipv6%]/g" "$pathB"
		cat "$pathA" > "$pathC"
		cat "$pathB" >> "$pathC"
	fi
done
for f in $startPath/*sh
do
	echo "Process file $f"
  file=$(echo $f | cut -f 9 -d / | cut -f 1 -d .)
  extension=$(echo $f | cut -f 9 -d / | cut -f 2 -d .)
	pathA="$startPath/ipv4/$file.$extension"
	pathB="$startPath/ipv6/$file.$extension"
	pathC="$startPath/ipv4ipv6/$file.$extension"
	
	mv "$startPath/$file.$extension" "$pathA"
	
	cp "$pathA" "$pathB"
	cp "$pathA" "$pathC"
done

if [ -d "$start/web/nginx/php5-fpm" ]; then
	startPath="$start/web/nginx/php5-fpm"
fi
if [ -d "$start/web/nginx/php-fpm" ]; then
	startPath="$start/web/nginx/php-fpm"
fi
mkdir $startPath/ipv4
mkdir $startPath/ipv4ipv6
mkdir $startPath/ipv6
for f in $startPath/*tpl
do
	echo "Process file $f"
  file=$(echo $f | cut -f 10 -d / | cut -f 1 -d .)
  extension=$(echo $f | cut -f 10 -d / | cut -f 2 -d .)
	pathA="$startPath/ipv4/$file.$extension"
	pathB="$startPath/ipv6/$file.$extension"
	pathC="$startPath/ipv4ipv6/$file.$extension"
	
	mv "$startPath/$file.$extension" "$pathA"
	
	cp "$pathA" "$pathB"
	sed -i "s/%ip%/[%ipv6%]/g" "$pathB"
	cat "$pathA" > "$pathC"
	cat "$pathB" >> "$pathC"
done


if [ -d "$start/web/php5-fpm" ]; then
	startPath="$start/web/php5-fpm"
fi
if [ -d "$start/web/php-fpm" ]; then
	startPath="$start/web/php-fpm"
fi
mkdir $startPath/ipv4
mkdir $startPath/ipv4ipv6
mkdir $startPath/ipv6
for f in $startPath/*tpl
do
	echo "Process file $f"
  file=$(echo $f | cut -f 9 -d / | cut -f 1 -d .)
  extension=$(echo $f | cut -f 9 -d / | cut -f 2 -d .)
	pathA="$startPath/ipv4/$file.$extension"
	pathB="$startPath/ipv6/$file.$extension"
	pathC="$startPath/ipv4ipv6/$file.$extension"
	
	mv "$startPath/$file.$extension" "$pathA"
	
	cp "$pathA" "$pathB"
	cp "$pathA" "$pathC"
done


startPath="$start/dns";
mkdir $startPath/ipv4
mkdir $startPath/ipv4ipv6
mkdir $startPath/ipv6
for f in $startPath/*tpl
do
	echo "Process file $f"
  file=$(echo $f | cut -f 8 -d / | cut -f 1 -d .)
	extension=$(echo $f | cut -f 8 -d / | cut -f 2 -d .)
	
	pathA="$startPath/ipv4/$file.$extension"
	pathB="$startPath/ipv6/$file.$extension"
	pathC="$startPath/ipv4ipv6/$file.$extension"
	
	mv "$startPath/$file.$extension" "$pathA"
	
	cp "$pathA" "$pathB"
	cp "$pathA" "$pathC"
	
	#update spf
	sed -i "s/ip4/ip6/g" "$pathB"
	sed -i "s/ip4:%ip%/ip4:%ip% ip6:%ipv6%/g" "$pathC"
	
	#ipv6 only
	sed -i "s/TYPE='A'/TYPE='AAA'/g" "$pathB"
	sed -i "s/%ip%/%ipv6%/g" "$pathB"
	
	#add AAAA line
	#get latest used ID
	
	#get all A lines copy with new ID and change A with AAAA and ipv4 with ipv6
	eval $(tail -n 1 $pathC)
	lastId=$(echo $ID)
	cat $pathC | while read line
	do
		if [ "$(echo $line | grep "TYPE='A'")" != "" ]; then
			eval $line
			echo "ID='$lastId' RECORD='$RECORD' TYPE='AAAA' PRIORITY='$PRIORITY' VALUE='%ipv6%' SUSPENDED='no' TIME='%time%' DATE='%date%'" >> "$pathC"
			lastId=$((lastId + 1))
		fi
	done
done

source /etc/profile.d/vesta.sh
/usr/local/vesta/bin/v-add-user-notification admin "New templates" "Due to the introduction of IPV6 in VestaCP we need to change all the templates. If you have your own custom templates place review them. "