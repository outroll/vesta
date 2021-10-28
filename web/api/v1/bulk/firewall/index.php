<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
    header('location: /login/');
    exit();
}

// Check user
if ($_SESSION['user'] != 'admin') {
    exit;
}


$rule = $_POST['rule'];
$action = $_POST['action'];

switch ($action) {
    case 'delete': $cmd='v-delete-firewall-rule';
        break;
    case 'suspend': $cmd='v-suspend-firewall-rule';
        break;
    case 'unsuspend': $cmd='v-unsuspend-firewall-rule';
        break;
    default: exit;
}

foreach ($rule as $value) {
    $value = escapeshellarg($value);
    exec (VESTA_CMD.$cmd." ".$value, $output, $return_var);
    $restart = 'yes';
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
