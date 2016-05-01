server {
    listen      %ip%:%proxy_port%;
    server_name %domain_idn% %alias_idn%;
    location / {
        rewrite ^(.*) https://%domain_idn%$1 permanent;
    }

    include /etc/nginx/services.conf;
}
