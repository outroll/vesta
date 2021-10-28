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

if (!empty($_GET['user'])) {
    $user=$_GET['user'];
}

// Mail domain
if ((!empty($_GET['domain'])) && (empty($_GET['account'])))  {
    $v_username = escapeshellarg($user);
    $v_domain = escapeshellarg($_GET['domain']);
    exec (VESTA_CMD."v-suspend-mail-domain ".$v_username." ".$v_domain, $output, $return_var);
    check_return_code($return_var,$output);
    unset($output);
}

// Mail account
if ((!empty($_GET['domain'])) && (!empty($_GET['account'])))  {
    $v_username = escapeshellarg($user);
    $v_domain = escapeshellarg($_GET['domain']);
    $v_account = escapeshellarg($_GET['account']);
    exec (VESTA_CMD."v-suspend-mail-account ".$v_username." ".$v_domain." ".$v_account, $output, $return_var);
    check_return_code($return_var,$output);
    unset($output);
}

echo json_encode(array('error' => $_SESSION['error_msg']));
unset($_SESSION['error_msg']);
