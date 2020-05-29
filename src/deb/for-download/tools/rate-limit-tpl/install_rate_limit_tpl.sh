#!/bin/bash

# This installer will install hosting-firewall.tpl (nginx template) that will:
# + allow 1 http request per second per IP address (sent to your server, more precisely to your PHP-FPM)
# + allow 2 parallel http connections per IP address (sent to your PHP-FPM)
# + allow burst for 7 additional http requests (they will enter queue), first 3 will be processed immediately, 4 others will processed each request each second (so this will handle natural peaks that CMS can generate to itself)
# + if client fills allowed queue, additional requests will be denied
#
# Generally, this nginx template will prevent bad bots to run hundreds parallel http requests against your site, which will probably cause denial-of-service on your server.
#
# There are also 3 additional templates, with larger limit values (for example: 2 req/sec, 14 allowed requests in queue, 7 burst, 8 parallel connections).

grepc=$(grep -c 'limit_conn_zone' /etc/nginx/nginx.conf)
if [ "$grepc" -eq 0 ]; then
    sed -i 's|server_names_hash_bucket_size   512;|server_names_hash_bucket_size   512;\n    limit_conn_zone $binary_remote_addr zone=addr:1m;\n    limit_req_zone $binary_remote_addr zone=one:1m rate=1r/s;\n    limit_req_zone $binary_remote_addr zone=two:1m rate=2r/s;\n    limit_conn_log_level error;\n    limit_req_log_level error;\n    limit_conn_status 429;\n    limit_req_status 429;|g' /etc/nginx/nginx.conf
    echo "=== Added rate_limit to nginx.conf"
fi

grepc=$(grep -c 'zone=addr:10m' /etc/nginx/nginx.conf)
if [ "$grepc" -eq 1 ]; then
    sed -i 's|zone=addr:10m|zone=addr:1m|g' /etc/nginx/nginx.conf
    echo "=== Decrease addr zone to 1mb to nginx.conf"
fi

grepc=$(grep -c 'zone=one:10m' /etc/nginx/nginx.conf)
if [ "$grepc" -eq 1 ]; then
    sed -i 's|zone=one:10m|zone=one:1m|g' /etc/nginx/nginx.conf
    echo "=== Decrease one zone to 1mb to nginx.conf"
fi

grepc=$(grep -c 'zone=two' /etc/nginx/nginx.conf)
if [ "$grepc" -eq 0 ]; then
    sed -i 's|zone=one:1m rate=1r/s;|zone=one:1m rate=1r/s;\n    limit_req_zone $binary_remote_addr zone=two:1m rate=2r/s;|g' /etc/nginx/nginx.conf
    echo "=== Added rate_limit for 2 req/sec to nginx.conf"
fi

wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall.tpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall.stpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.tpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall.stpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall.stpl

wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall-burst-2.tpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall-burst-2.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall-burst-2.stpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall-burst-2.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall-burst-2.tpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall-burst-2.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall-burst-2.stpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall-burst-2.stpl

wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall-burst-2-speed-2.tpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall-burst-2-speed-2.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall-burst-2-speed-2.stpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall-burst-2-speed-2.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall-burst-2-speed-2.tpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall-burst-2-speed-2.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall-burst-2-speed-2.stpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall-burst-2-speed-2.stpl

wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall-burst-2-speed-2-conn-4.tpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall-burst-2-speed-2-conn-4.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/force-https-firewall-burst-2-speed-2-conn-4.stpl http://c.myvestacp.com/tools/rate-limit-tpl/force-https-firewall-burst-2-speed-2-conn-4.stpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall-burst-2-speed-2-conn-4.tpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall-burst-2-speed-2-conn-4.tpl
wget -nv -O /usr/local/vesta/data/templates/web/nginx/hosting-firewall-burst-2-speed-2-conn-4.stpl http://c.myvestacp.com/tools/rate-limit-tpl/hosting-firewall-burst-2-speed-2-conn-4.stpl

service nginx restart
