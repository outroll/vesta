server {
    listen      %ip%:%web_port%;
    server_name %domain_idn% %alias_idn%;

    root        %docroot%/pub;
    index       index.php;
    autoindex   off;
    charset     UTF-8;
    error_page  404 403 = /errors/404.php;
    add_header  "X-UA-Compatible" "IE=Edge";

    access_log  /var/log/nginx/domains/%domain%.log combined;
    access_log  /var/log/nginx/domains/%domain%.bytes bytes;
    error_log   /var/log/nginx/domains/%domain%.error.log error;

    # PHP entry point for setup application
    location ~* ^/setup($|/) {
        root %docroot%;

        location ~ ^/setup/index.php {
            fastcgi_pass   %backend_lsnr%;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include        /etc/nginx/fastcgi_params;
        }

        location ~ ^/setup/(?!pub/). {
            deny all;
        }

        location ~ ^/setup/pub/ {
            add_header X-Frame-Options "SAMEORIGIN";
        }
    }

    # PHP entry point for update application
    location ~* ^/update($|/) {
        root %docroot%;

        location ~ ^/update/index.php {
            fastcgi_split_path_info ^(/update/index.php)(/.+)$;
            fastcgi_pass   %backend_lsnr%;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            fastcgi_param  PATH_INFO        $fastcgi_path_info;
            include        /etc/nginx/fastcgi_params;
        }

        # Deny everything but index.php
        location ~ ^/update/(?!pub/). {
            deny all;
        }

        location ~ ^/update/pub/ {
            add_header X-Frame-Options "SAMEORIGIN";
        }
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location /pub/ {
        location ~ ^/pub/media/(downloadable|customer|import|theme_customization/.*\.xml) {
            deny all;
        }

        alias %docroot%/pub/;
        add_header X-Frame-Options "SAMEORIGIN";
    }

    location /static/ {
        # Uncomment the following line in production mode
        # expires max;

        # Remove signature of the static files that is used to overcome the browser cache
        location ~ ^/static/version {
            rewrite ^/static/(version\d*/)?(.*)$ /static/$2 last;
        }

        location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2)$ {
            add_header Cache-Control "public";
            add_header X-Frame-Options "SAMEORIGIN";
            expires +1y;

            if (!-f $request_filename) {
                rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
            }
        }

        location ~* \.(zip|gz|gzip|bz2|csv|xml)$ {
            add_header Cache-Control "no-store";
            add_header X-Frame-Options "SAMEORIGIN";
            expires    off;

            if (!-f $request_filename) {
                rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
            }
        }

        if (!-f $request_filename) {
            rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
        }

        add_header X-Frame-Options "SAMEORIGIN";
    }

    location /media/ {
        try_files $uri $uri/ /get.php?$args;

        location ~ ^/media/theme_customization/.*\.xml {
            deny all;
        }

        location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2)$ {
            add_header Cache-Control "public";
            add_header X-Frame-Options "SAMEORIGIN";
            expires +1y;
            try_files $uri $uri/ /get.php?$args;
        }

        location ~* \.(zip|gz|gzip|bz2|csv|xml)$ {
            add_header Cache-Control "no-store";
            add_header X-Frame-Options "SAMEORIGIN";
            expires    off;
            try_files $uri $uri/ /get.php?$args;
        }

        add_header X-Frame-Options "SAMEORIGIN";
    }

    location /media/customer/ {
        deny all;
    }

    location /media/downloadable/ {
        deny all;
    }

    location /media/import/ {
        deny all;
    }

    # PHP entry point for main application
    location ~ (index|get|static|report|404|503)\.php$ {
        try_files $uri =404;

        fastcgi_pass   %backend_lsnr%;
        fastcgi_buffers 1024 4k;
        fastcgi_read_timeout 600s;
        fastcgi_connect_timeout 600s;

        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        /etc/nginx/fastcgi_params;
    }

    gzip on;
    gzip_disable "msie6";

    gzip_comp_level 6;
    gzip_min_length 1100;
    gzip_buffers 16 8k;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml;
    gzip_vary on;

    # Banned locations (only reached if the earlier PHP entry point regexes don't match)
    location ~* (\.php$|\.htaccess$|\.git) {
        deny all;
    }

    location /vstats/ {
        alias   %home%/%user%/web/%domain%/stats/;
        include %home%/%user%/conf/web/%domain%.auth*;
    }

    include     /etc/nginx/conf.d/phpmyadmin.inc*;
    include     /etc/nginx/conf.d/phppgadmin.inc*;
    include     /etc/nginx/conf.d/webmail.inc*;

    include     %home%/%user%/conf/web/nginx.%domain%.conf*;
}
