<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
    exit();
}

if ($_SESSION['user'] == 'admin') {
    if (!empty($_GET['hostname'])) {
        exec (VESTA_CMD."v-restart-system yes", $output, $return_var);
        $_SESSION['error_msg'] = 'The system is going down for reboot NOW!';
    }
    unset($output);
}

echo json_encode(array('error' => $_SESSION['error_msg']));

unset($_SESSION['error_msg']);
