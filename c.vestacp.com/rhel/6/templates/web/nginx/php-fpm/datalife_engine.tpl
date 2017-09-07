server {
    listen      %ip%:%web_port%;
    server_name %domain_idn% %alias_idn%;
    root        %docroot%;
    index       index.php index.html index.htm;
    access_log  /var/log/nginx/domains/%domain%.log combined;
    access_log  /var/log/nginx/domains/%domain%.bytes bytes;
    error_log   /var/log/nginx/domains/%domain%.error.log error;

    location / {
        rewrite "^/page/([0-9]+)(/?)$" /index.php?cstart=$1 last;

        rewrite "^/([0-9]{4})/([0-9]{2})/([0-9]{2})/page,([0-9]+),([0-9]+),(.*).html(/?)+$" /index.php?subaction=showfull&year=$1&month=$2&day=$3&news_page=$4&cstart=$5&news_name=$6&seourl=$6 last;
        rewrite "^/([0-9]{4})/([0-9]{2})/([0-9]{2})/page,([0-9]+),(.*).html(/?)+$" /index.php?subaction=showfull&year=$1&month=$2&day=$3&news_page=$4&news_name=$5&seourl=$5 last;
        rewrite "^/([0-9]{4})/([0-9]{2})/([0-9]{2})/print:page,([0-9]+),(.*).html(/?)+$" /engine/print.php?subaction=showfull&year=$1&month=$2&day=$3&news_page=$4&news_name=$5&seourl=$5 last;
        rewrite "^/([0-9]{4})/([0-9]{2})/([0-9]{2})/(.*).html(/?)+$" /index.php?subaction=showfull&year=$1&month=$2&day=$3&news_name=$4&seourl=$4 last;

        rewrite "^/([^.]+)/page,([0-9]+),([0-9]+),([0-9]+)-(.*).html(/?)+$" /index.php?newsid=$4&news_page=$2&cstart=$3&seourl=$5&seocat=$1 last;
        rewrite "^/([^.]+)/page,([0-9]+),([0-9]+)-(.*).html(/?)+$" /index.php?newsid=$3&news_page=$2&seourl=$4&seocat=$1 last;
        rewrite "^/([^.]+)/print:page,([0-9]+),([0-9]+)-(.*).html(/?)+$" /engine/print.php?news_page=$2&newsid=$3&seourl=$4&seocat=$1 last;
        rewrite "^/([^.]+)/([0-9]+)-(.*).html(/?)+$" /index.php?newsid=$2&seourl=$3&seocat=$1 last;

        rewrite "^/page,([0-9]+),([0-9]+),([0-9]+)-(.*).html(/?)+$" /index.php?newsid=$3&news_page=$1&cstart=$2&seourl=$4 last;
        rewrite "^/page,([0-9]+),([0-9]+)-(.*).html(/?)+$" /index.php?newsid=$2&news_page=$1&seourl=$3 last;
        rewrite "^/print:page,([0-9]+),([0-9]+)-(.*).html(/?)+$" /engine/print.php?news_page=$1&newsid=$2&seourl=$3 last;
        rewrite "^/([0-9]+)-(.*).html(/?)+$" /index.php?newsid=$1&seourl=$2 last;

        rewrite "^/([0-9]{4})/([0-9]{2})/([0-9]{2})(/?)+$" /index.php?year=$1&month=$2&day=$3 last;
        rewrite "^/([0-9]{4})/([0-9]{2})/([0-9]{2})/page/([0-9]+)(/?)+$" /index.php?year=$1&month=$2&day=$3&cstart=$4 last;

        rewrite "^/([0-9]{4})/([0-9]{2})(/?)+$" /index.php?year=$1&month=$2 last;
        rewrite "^/([0-9]{4})/([0-9]{2})/page/([0-9]+)(/?)+$" /index.php?year=$1&month=$2&cstart=$3 last;

        rewrite "^/([0-9]{4})(/?)+$" /index.php?year=$1 last;
        rewrite "^/([0-9]{4})/page/([0-9]+)(/?)+$" /index.php?year=$1&cstart=$2 last;

        rewrite "^/tags/([^/]*)(/?)+$" /index.php?do=tags&tag=$1 last;
        rewrite "^/tags/([^/]*)/page/([0-9]+)(/?)+$" /index.php?do=tags&tag=$1&cstart=$2 last;

        rewrite "^/xfsearch/([^/]*)(/?)+$" /index.php?do=xfsearch&xf=$1 last;
        rewrite "^/xfsearch/([^/]*)/page/([0-9]+)(/?)+$" /index.php?do=xfsearch&xf=$1&cstart=$2 last;

        rewrite "^/user/([^/]*)/rss.xml$" /engine/rss.php?subaction=allnews&user=$1 last;
        rewrite "^/user/([^/]*)(/?)+$" /index.php?subaction=userinfo&user=$1 last;
        rewrite "^/user/([^/]*)/page/([0-9]+)(/?)+$" /index.php?subaction=userinfo&user=$1&cstart=$2 last;
        rewrite "^/user/([^/]*)/news(/?)+$" /index.php?subaction=allnews&user=$1 last;
        rewrite "^/user/([^/]*)/news/page/([0-9]+)(/?)+$" /index.php?subaction=allnews&user=$1&cstart=$2 last;
        rewrite "^/user/([^/]*)/news/rss.xml(/?)+$" /engine/rss.php?subaction=allnews&user=$1 last;

        rewrite "^/lastnews(/?)+$" /index.php?do=lastnews last;
        rewrite "^/lastnews/page/([0-9]+)(/?)+$" /index.php?do=lastnews&cstart=$1 last;

        rewrite "^/catalog/([^/]*)/rss.xml$" /engine/rss.php?catalog=$1 last;
        rewrite "^/catalog/([^/]*)(/?)+$" /index.php?catalog=$1 last;
        rewrite "^/catalog/([^/]*)/page/([0-9]+)(/?)+$" /index.php?catalog=$1&cstart=$2 last;

        rewrite "^/newposts(/?)+$" /index.php?subaction=newposts last;
        rewrite "^/newposts/page/([0-9]+)(/?)+$" /index.php?subaction=newposts&cstart=$1 last;

        rewrite "^/favorites(/?)+$" /index.php?do=favorites last;
        rewrite "^/favorites/page/([0-9]+)(/?)+$" /index.php?do=favorites&cstart=$1 last;

        rewrite "^/rules.html$" /index.php?do=rules last;
        rewrite "^/statistics.html$" /index.php?do=stats last;
        rewrite "^/addnews.html$" /index.php?do=addnews last;
        rewrite "^/rss.xml$" /engine/rss.php last;
        rewrite "^/sitemap.xml$" /uploads/sitemap.xml last;

        if (!-d $request_filename) {
                rewrite "^/([^.]+)/page/([0-9]+)(/?)+$" /index.php?do=cat&category=$1&cstart=$2 last;
                rewrite "^/([^.]+)/?$" /index.php?do=cat&category=$1 last;
        }

        if (!-f $request_filename) {
                rewrite "^/([^.]+)/rss.xml$" /engine/rss.php?do=cat&category=$1 last;
                rewrite "^/page,([0-9]+),([^/]+).html$" /index.php?do=static&page=$2&news_page=$1 last;
                rewrite "^/print:([^/]+).html$" /engine/print.php?do=static&page=$1 last;
        }

        if (!-f $request_filename) {
                rewrite "^/([^/]+).html$" /index.php?do=static&page=$1 last;
        }

        location ~* ^.+\.(jpeg|jpg|png|gif|bmp|ico|svg|css|js)$ {
            expires     max;
        }

        location ~ [^/]\.php(/|$) {
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            if (!-f $document_root$fastcgi_script_name) {
                return  404;
            }

            fastcgi_pass    %backend_lsnr%;
            fastcgi_index   index.php;
            include         /etc/nginx/fastcgi_params;
        }
    }

    error_page  403 /error/404.html;
    error_page  404 /error/404.html;
    error_page  500 502 503 504 /error/50x.html;

    location /error/ {
        alias   %home%/%user%/web/%domain%/document_errors/;
    }

    location ~* "/\.(htaccess|htpasswd)$" {
        deny    all;
        return  404;
    }

    location /vstats/ {
        alias   %home%/%user%/web/%domain%/stats/;
        include %home%/%user%/web/%domain%/stats/auth.conf*;
    }

    include     /etc/nginx/conf.d/phpmyadmin.inc*;
    include     /etc/nginx/conf.d/phppgadmin.inc*;
    include     /etc/nginx/conf.d/webmail.inc*;

    include     %home%/%user%/conf/web/nginx.%domain_idn%.conf*;
}
