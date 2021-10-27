<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check user
if ($_SESSION['user'] != 'admin') {
    exit;
}

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
    exit();
}

if (!empty($_GET['rule'])) {
    $v_rule = escapeshellarg($_GET['rule']);
    exec (VESTA_CMD."v-delete-firewall-rule ".$v_rule, $output, $return_var);
}
check_return_code($return_var,$output);
unset($output);

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
