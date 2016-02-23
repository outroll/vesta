server {
    listen       [%ipv6%]:%proxy_port% default;
    server_name  _;
    #access_log  /var/log/nginx/[%ipv6%].log main;
    location / {
        proxy_pass  http://[%ipv6%]:%web_port%;
   }
}

