server {

    listen      %ip%:%proxy_port%;
    server_name %domain_idn% %alias_idn%;
    root        %docroot%;
    index       index.php index.html index.htm;
    access_log  /var/log/nginx/domains/%domain%.log combined;
    access_log  /var/log/nginx/domains/%domain%.bytes bytes;
    error_log   /var/log/nginx/domains/%domain%.error.log error;

    try_files $uri $uri/ /index.php?$query_string;

    location /index.php {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
    }
    
    # for install only
    location /install.php {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
    }    
    
    location /api.php {
        fastcgi_split_path_info  ^(.+\.php)(.*)$;
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
    }
    
    location ~ /(oauth.php|link.php|payments.php) {
        try_files $uri $uri/ /index.php?$query_string;
    }    

    location ^~ /wa-data/protected/ {
        internal;
    }
    
    location ~ /wa-content {
        allow all;
    }

    location ^~ /(wa-apps|wa-plugins|wa-system|wa-widgets)/.*/(lib|locale|templates)/ {
        deny all;
    }

    location ~* ^/wa-(cache|config|installer|log|system)/ {
        return 403;
    }

    location ~* ^/wa-data/public/contacts/photos/[0-9]+/ {
         root %docroot%;
         access_log off;
         expires  30d;
         error_page   404  =  @contacts_thumb;
    }

    location @contacts_thumb {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
        fastcgi_param  SCRIPT_NAME  /wa-data/public/contacts/photos/thumb.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root/wa-data/public/contacts/photos/thumb.php;
    }
  
    # photos app
    location ~* ^/wa-data/public/photos/[0-9]+/ {
        access_log   off;
        expires      30d;
        error_page   404  =  @photos_thumb;
    }

    location @photos_thumb {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
        fastcgi_param  SCRIPT_NAME  /wa-data/public/photos/thumb.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root/wa-data/public/photos/thumb.php;
    }
    # end photos app
    
    # shop app
    location ~* ^/wa-data/public/shop/products/[0-9]+/ {
        access_log   off;
        expires      30d;
        error_page   404  =  @shop_thumb;
    }
    location @shop_thumb {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
        fastcgi_param  SCRIPT_NAME  /wa-data/public/shop/products/thumb.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root/wa-data/public/shop/products/thumb.php;
    }
    
    location ~* ^/wa-data/public/shop/promos/[0-9]+ {
        access_log   off;
        expires      30d;
        error_page   404  =  @shop_promo;
    }
    location @shop_promo {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
        fastcgi_param  SCRIPT_NAME  /wa-data/public/shop/promos/thumb.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root/wa-data/public/shop/promos/thumb.php;
    }
    # end shop app
    
    # mailer app
    location ~* ^/wa-data/public/mailer/files/[0-9]+/ {
        access_log   off;
        error_page   404  =  @mailer_file;
    }
    location @mailer_file {
        include /etc/nginx/wa-fastcgi_params;
        fastcgi_pass  unix:/run/php7.4-fpm-%domain_idn%.sock;
        fastcgi_param  SCRIPT_NAME  /wa-data/public/mailer/files/file.php;
        fastcgi_param  SCRIPT_FILENAME $document_root/wa-data/public/mailer/files/file.php;
    }
    # end mailer app

    location ~* ^.+\.(%proxy_extentions%)$ {
        access_log   off;
        expires      30d;
    }

    location /error/ {
        alias   %home%/%user%/web/%domain%/document_errors/;
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