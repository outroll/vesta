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
    exit();
}

// Check user
if ($_SESSION['user'] != 'admin') {
    exit;
}

$ipchain = $_POST['ipchain'];
$action = $_POST['action'];

switch ($action) {
    case 'delete': $cmd='v-delete-firewall-ban';
        break;
    default: exit;
}

foreach ($ipchain as $value) {
    list($ip,$chain) = explode(":",$value);
    $v_ip    = escapeshellarg($ip);
    $v_chain = escapeshellarg($chain);
    exec (VESTA_CMD.$cmd." ".$v_ip." ".$v_chain, $output, $return_var);
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
