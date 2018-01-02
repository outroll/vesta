<?php
if(isset($_GET['plugin'])) {
    error_reporting(E_ALL);
    
    // Main include
    include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
    
    $url = "/list?plugin=" . $_GET['plugin'];
    $function = null;
    foreach($topMenuItems as $menuItem) {
        if(strlen($menuItem['page']) >= strlen($url) && substr($menuItem['page'], 0, strlen($url)) == $url) {
            $function = $menuItem['callback'];
            continue;
        }
        if(isset($menuItem['child'])) {
            foreach($menuItem['child'] as $child) {
                if(strlen($child['page']) >= strlen($url) && substr($child['page'], 0, strlen($url)) == $url) {
                    $function = $child['callback'];
                    continue;
                }
            }
        }
    }
    
    // Render page
    render_page($user, $TAB, $function);

    // Back uri
    $_SESSION['back'] = $_SERVER['REQUEST_URI'];
    exit;
}

session_start();
if (isset($_SESSION['user'])) {
    header("Location: /list/user/");
} else {
    header("Location: /login/");
}
?>
