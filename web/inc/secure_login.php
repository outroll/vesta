<?php

$skip_login_url_check=0;
if ($_SERVER['SCRIPT_FILENAME']=='/usr/local/vesta/web/reset/mail/index.php') $skip_login_url_check=1; // it's accessible only from localhost
if ($_SERVER['SCRIPT_FILENAME']=='/usr/local/vesta/web//reset/mail/index.php') $skip_login_url_check=1;

if ($_SERVER['SCRIPT_FILENAME']=='/usr/local/vesta/web/reset/mail/set-ar.php') $skip_login_url_check=1; // commercial addon for changing auto-reply from Roundcube, not included in this fork, also accessible only from localhost
if ($_SERVER['SCRIPT_FILENAME']=='/usr/local/vesta/web//reset/mail/set-ar.php') $skip_login_url_check=1;
if ($_SERVER['SCRIPT_FILENAME']=='/usr/local/vesta/web/reset/mail/get-ar.php') $skip_login_url_check=1;
if ($_SERVER['SCRIPT_FILENAME']=='/usr/local/vesta/web//reset/mail/get-ar.php') $skip_login_url_check=1;
if (substr($_SERVER['SCRIPT_FILENAME'], 0, 28)=='/usr/local/vesta/web/custom/') $login_url_skip=1; // custom scripts like git webhooks
if (substr($_SERVER['SCRIPT_FILENAME'], 0, 29)=='/usr/local/vesta/web//custom/') $login_url_skip=1;

if (substr($_SERVER['SCRIPT_FILENAME'], 0, 21)=='/usr/local/vesta/bin/') $skip_login_url_check=1; // allow executing v-* PHP scripts from bash
if (substr($_SERVER['SCRIPT_FILENAME'], 0, 29)=='/usr/local/vesta/softaculous/') $skip_login_url_check=1; // allow softaculous
if (substr($_SERVER['SCRIPT_FILENAME'], 0, 33)=='/usr/local/vesta/web/softaculous/') $skip_login_url_check=1; // allow softaculous
if (substr($_SERVER['SCRIPT_FILENAME'], 0, 34)=='/usr/local/vesta/web//softaculous/') $skip_login_url_check=1; // allow softaculous

if ($skip_login_url_check==0) {
    if (!isset($login_url_loaded)) {
        $login_url_loaded=1;
        if (file_exists('/usr/local/vesta/web/inc/login_url.php')) {
            require_once('/usr/local/vesta/web/inc/login_url.php'); // get secret url
            if (isset($_GET[$login_url])) {                         // check if user opened secret url
                $Domain=$_SERVER['HTTP_HOST'];
                $Port = strpos($Domain, ':');
                if ($Port !== false)  $Domain = substr($Domain, 0, $Port);
                setcookie($login_url, '1', time() + 31536000, '/', $Domain, true); // set secret cookie
                header ("Location: /login/");
                exit;
            }
            if (!isset($_COOKIE[$login_url])) exit; // die if secret cookie is not set
        }
    }
}
