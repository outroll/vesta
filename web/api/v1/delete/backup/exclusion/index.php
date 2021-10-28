<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
header('Content-Type: application/json');
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

if (($_SESSION['user'] == 'admin') && (!empty($_GET['user']))) {
    $user=$_GET['user'];
}

if (!empty($_GET['system'])) {
    $v_username = escapeshellarg($user);
    $v_system = escapeshellarg($_GET['system']);
    exec (VESTA_CMD."v-delete-user-backup-exclusions ".$v_username." ".$v_system, $output, $return_var);
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
