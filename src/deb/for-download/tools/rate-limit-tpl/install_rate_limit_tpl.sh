#!/bin/bash

grepc=$(grep -c 'limit_conn_zone' /etc/nginx/nginx.conf)
if [ "$grepc" -eq 0 ]; then
    sed -i 's|server_names_hash_bucket_size   512;|server_names_hash_bucket_size   512;\n    limit_conn_zone $binary_remote_addr zone=addr:10m;\n    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;\n    limit_conn_log_level error;\n    limit_req_log_level error;\n    limit_conn_status 429;\n    limit_req_status 429;|g' /etc/nginx/nginx.conf
    echo "=== Added rate_limit to nginx.conf"
fi

wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall.tpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall.stpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.tpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.stpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.sh http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.sh
chmod a+x /usr/local/vesta/data/templates/web/nginx/hosting-firewall.sh

service nginx restart
