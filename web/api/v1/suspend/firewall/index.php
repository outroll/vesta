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

// Check user
if ($_SESSION['user'] != 'admin') {
    exit;
}

if (!empty($_GET['rule'])) {
    $v_rule = escapeshellarg($_GET['rule']);
    exec (VESTA_CMD."v-suspend-firewall-rule ".$v_rule, $output, $return_var);
}
check_return_code($return_var,$output);
unset($output);

echo json_encode(array('error' => $_SESSION['error_msg']));
unset($_SESSION['error_msg']);
