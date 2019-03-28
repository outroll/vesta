location /adminer {
    alias /usr/share/adminer/;

    location ~ ^/adminer/(.*\.php)$ {
        alias /usr/share/adminer/$1;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $request_filename;
    }
    location ~* ^/adminer/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
        alias /usr/share/adminer/$1;
    }
}
