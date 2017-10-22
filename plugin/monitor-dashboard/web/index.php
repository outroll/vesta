<?php
$url = $_SERVER['SERVER_NAME'];
if(empty($url) || $url == "_") {
    $url = $_SERVER['SERVER_ADDR'];
}
add_top_menu_item('Monitor Dashboard', 'http://' . $url . ":3000", true, "Plugin", 1, 'loadMonitorDashboard');

function loadMonitorDashboard() {
    
}