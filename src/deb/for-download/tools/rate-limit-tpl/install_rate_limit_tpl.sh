#!/bin/bash

# This installer will install hosting-firewall.tpl (nginx template) that will:
# + allow 1 http request per second per IP address (sent to your server, more precisely to your PHP-FPM)
# + allow 2 parallel http connections per IP address (sent to your PHP-FPM)
# + allow burst for 7 additional http requests (they will enter queue), first 3 will be processed immediately, 4 others will processed each request each second (so this will handle natural peaks that CMS can generate to itself)
# + if client fills allowed queue, additional requests will be denied
#
# Generally, this nginx template will prevent bad bots to run hundreds parallel http requests against your site, which will probably cause denial-of-service on your server.

grepc=$(grep -c 'limit_conn_zone' /etc/nginx/nginx.conf)
if [ "$grepc" -eq 0 ]; then
    sed -i 's|server_names_hash_bucket_size   512;|server_names_hash_bucket_size   512;\n    limit_conn_zone $binary_remote_addr zone=addr:1m;\n    limit_req_zone $binary_remote_addr zone=one:1m rate=1r/s;\n    limit_req_zone $binary_remote_addr zone=two:1m rate=2r/s;\n    limit_conn_log_level error;\n    limit_req_log_level error;\n    limit_conn_status 429;\n    limit_req_status 429;|g' /etc/nginx/nginx.conf
    echo "=== Added rate_limit to nginx.conf"
fi

wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall.tpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall.stpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.tpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.stpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.sh http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.sh
chmod a+x /usr/local/vesta/data/templates/web/nginx/hosting-firewall.sh

service nginx restart
