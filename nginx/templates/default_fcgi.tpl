server {
    listen      %ip%:%proxy_port%;
    server_name %domain_idn% %alias_idn%;
    error_log  /var/log/apache2/domains/%domain%.error.log error;
    location / {
        location ~* ^.+\.(%proxy_extentions%)$ {
            root           %docroot%;
            access_log     /var/log/nginx/domains/%domain%.log combined;
            access_log     /var/log/nginx/domains/%domain%.bytes bytes;
            expires        max;
            #try_files      $uri;
        }
		
		root           %docroot%;
		index index.php  index.html index.htm;
		
    }

    location /error/ {
        alias   %home%/%user%/web/%domain%/document_errors/;
    }
	
	location ~ \.php$ {
			root           %docroot%;
			fastcgi_pass   127.0.0.1:9000;
			fastcgi_index  index.php;
			fastcgi_param  SCRIPT_FILENAME   $document_root$fastcgi_script_name;
			include        fastcgi_params;
	}

    location ~ /\.ht    {return 404;}
    location ~ /\.svn/  {return 404;}
    location ~ /\.git/  {return 404;}
    location ~ /\.hg/   {return 404;}
    location ~ /\.bzr/  {return 404;}

    include %home%/%user%/conf/web/nginx.%domain%.conf*;
}
