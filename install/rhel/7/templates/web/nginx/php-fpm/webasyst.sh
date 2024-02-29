#!/bin/bash
user="$1"
domain="$2"
ip="$3"
home_dir="$4"
docroot="$5"
pool_conf="
[$2]
listen = /run/php7.4-fpm-$2.sock
listen.owner = $1
listen.group = nginx
listen.mode = 0660

user = $1
group = $1

pm = ondemand
pm.max_children = 4
pm.max_requests = 4000
pm.process_idle_timeout = 10s
pm.status_path = /status

php_admin_value[upload_tmp_dir] = /home/$1/tmp
php_admin_value[session.save_path] = /home/$1/tmp
php_admin_value[open_basedir] = /home/$1/.composer:/home/$1/web/$2/public_html:/home/$1/web/$2/private:/home/$1/web/$2/public_shtml:/home/$1/tmp:/tmp:/var/www/html:/bin:/usr/bin:/usr/local/bin:/usr/share:/opt
php_admin_value[sendmail_path] = /usr/sbin/sendmail -t -i -f $1@$2

env[PATH] = /usr/local/bin:/usr/bin:/bin
env[TMP] = /home/$1/tmp
env[TMPDIR] = /home/$1/tmp
env[TEMP] = /home/$1/tmp
"

fastcgi_param="
fastcgi_param SCRIPT_FILENAME     $document_root$fastcgi_script_name;
fastcgi_param PATH_INFO           $fastcgi_path_info;

fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;
fastcgi_param  REQUEST_SCHEME     $scheme;
fastcgi_param  HTTPS              $https if_not_empty;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP only, required if PHP was built with --enable-force-cgi-redirect
fastcgi_param  REDIRECT_STATUS    200;"

pool_file_74="/etc/opt/remi/php74/php-fpm.d/$2.conf"
    
# если репозиторий remi есть, то устанавливаем php73-php-fpm, иначе - выход
if [ -f /etc/yum.repos.d/remi-php74.repo ] ; then
    yum install php74-php-fpm php74-php-mbstring php74-php-curl php74-php-gd php74-php-zlib php74-php-gettext
        else
            echo "check this https://blog.remirepo.net/post/2019/12/03/Install-PHP-7.4-on-CentOS-RHEL-or-Fedora"
        exit 0
fi

if [ -f "/etc/opt/remi/php74/php-fpm.d/www.conf" ]; then
    rm -f /etc/opt/remi/php74/php-fpm.d/www.conf
fi

find /etc/opt/remi/*/php-fpm.d/ -type f -name "$2.conf" -delete
echo "$fastcgi_param" > /etc/nginx/wa-fastcgi_params

if [ -f "$pool_file_74" ]; then
        rm -f $pool_file_74
        echo "$pool_conf" > $pool_file_74
        systemctl restart php74-php-fpm

        else
                echo "$pool_conf" > $pool_file_74
                systemctl restart php74-php-fpm
fi

exit 0
