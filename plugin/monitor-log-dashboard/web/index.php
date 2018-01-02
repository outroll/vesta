<?php
$url = $_SERVER['SERVER_NAME'];
if(empty($url) || $url == "_") {
    $url = $_SERVER['SERVER_ADDR'];
}
add_top_menu_item('Logging Dashboard', 'http://logging.' . $url, true, "Plugin", 1, 'loadLoggingDashboard');

function loadLoggingDashboard() {
    
}