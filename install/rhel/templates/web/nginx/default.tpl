server {
    listen      %ip%:%proxy_port%;
    server_name %domain_idn% %alias_idn%;
    index index.html index.htm;
    root %docroot%;
    error_log  /var/log/httpd/domains/%domain%.error.log error;
    location / {try_files $uri @backend;}
    location ~ .*\.(php|jsp|cgi|pl|py|php4|php5)?$ {
	access_log  off;
	proxy_pass https://%ip%:%web_port%;
    }
    location ~* ^.+\.(%proxy_extentions%)$ {
            access_log     /var/log/httpd/domains/%domain%.log combined;
            access_log     /var/log/httpd/domains/%domain%.bytes bytes;
            expires        max;
            try_files      $uri @backend;
    }
    location @backend {proxy_pass  https://%ip%:%web_ssl_port%;}
    location /error/ {alias   %home%/%user%/web/%domain%/document_errors/;}
    location ~ .*\.(mp3|ftpquota|htaccess|svn|ht|git|hg|bzr)?\$ {deny all;}
}
