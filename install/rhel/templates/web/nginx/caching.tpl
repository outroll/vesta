server {
    listen      %ip%:%proxy_port%;
    server_name %domain_idn% %alias_idn%;
    error_log  /var/log/httpd/domains/%domain%.error.log error;

    location / {
        proxy_pass      http://%ip%:%web_port%;

        proxy_cache cache;
        proxy_cache_valid 15m;
        proxy_cache_valid 404 1m;
        proxy_no_cache $no_cache;
        proxy_cache_bypass $no_cache;
        proxy_cache_bypass $cookie_session $http_x_update;

        location ~* ^.+\.(%proxy_extentions%)$ {
            proxy_cache    off;
            root           %docroot%;
            access_log     /var/log/httpd/domains/%domain%.log combined;
            access_log     /var/log/httpd/domains/%domain%.bytes bytes;
            expires        max;
            try_files      $uri @fallback;
        }
    }

    location /error/ {
        alias   %home%/%user%/web/%domain%/document_errors/;
    }

    location @fallback {
        proxy_pass      http://%ip%:%web_port%;
    }
    
    location ~ .*\.(mp3|ftpquota|htaccess|svn|ht|git|hg|bzr)?\$ {deny all;}
}
