<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
header('Content-Type: application/json');
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
    exit();
}

if ($_SESSION['user'] == 'admin') {
    if (!empty($_GET['package'])) {
        $v_package = escapeshellarg($_GET['package']);
        exec (VESTA_CMD."v-delete-user-package ".$v_package, $output, $return_var);
    }
    check_return_code($return_var,$output);
    unset($output);
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
