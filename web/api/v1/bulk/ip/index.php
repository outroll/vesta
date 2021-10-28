<?php
// Init
error_reporting(NULL);
ob_start();
session_start();

header('Content-Type: application/json');
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
    exit();
}

$ip = $_POST['ip'];
$action = $_POST['action'];

if ($_SESSION['user'] == 'admin') {
    switch ($action) {
        case 'reread IP': exec(VESTA_CMD."v-update-sys-ip", $output, $return_var);
                exit;
            break;
        case 'delete': $cmd='v-delete-sys-ip';
            break;
        default: exit;
    }
} else {
    exit;
}

foreach ($ip as $value) {
    $value = escapeshellarg($value);
    exec (VESTA_CMD.$cmd." ".$value, $output, $return_var);
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
