<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
    header('location: /login/');
    exit();
}

if ($_SESSION['user'] == 'admin') {
    if (!empty($_GET['ip'])) {
            
        // List ip
        $v_ip = escapeshellarg($_GET['ip']);
        exec (VESTA_CMD."v-list-sys-ip ".$v_ip." 'json'", $output, $return_var);
        check_return_code($return_var,$output);
        $data = json_decode(implode('', $output), true);
        unset($output);

        // Parse ip
        $v_username = $user;
        $v_ip = $_GET['ip'];
        $v_version = $data[$v_ip]['VERSION'];
        if($v_version == 6) {
            exec (VESTA_CMD."v-delete-sys-ipv6 ".$v_ip, $output, $return_var);
        } else {
            exec (VESTA_CMD."v-delete-sys-ip ".$v_ip, $output, $return_var);
        }
    }
    check_return_code($return_var,$output);
    unset($output);

}

$back = $_SESSION['back'];
if (!empty($back)) {
    header("Location: ".$back);
    exit;
}

header("Location: /list/ip/");
exit;
