 <?php
 // Custom script that will be included in custom Vesta installations to allow normal index.html if Vesta was proxied via default nginx

if (file_exists("/usr/local/vesta/web/inc/switch_to_vesta_port") && isset($_SERVER['HTTP_X_REAL_IP']) && $_SERVER['REQUEST_URI']=="/") {
	$hostname=trim(shell_exec("hostname"));
	$user=trim(shell_exec("sudo /usr/local/vesta/bin/v-search-domain-owner ".$hostname));
	if (file_exists("/home/$user/web/$hostname/public_html/index.html")) {echo file_get_contents("/home/$user/web/$hostname/public_html/index.html"); exit;}
	if (file_exists("/home/$user/web/$hostname/public_html/index.php")) {include("/home/$user/web/$hostname/public_html/index.php"); exit;}
}
