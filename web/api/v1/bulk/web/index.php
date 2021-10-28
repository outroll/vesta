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

$domain = $_POST['domain'];
$action = $_POST['action'];

if ($_SESSION['user'] == 'admin') {
    switch ($action) {
        case 'delete': $cmd='v-delete-domain';
            break;
        case 'suspend': $cmd='v-suspend-domain';
            break;
        case 'unsuspend': $cmd='v-unsuspend-domain';
            break;
        default: exit;
    }
} else {
    switch ($action) {
        case 'delete': $cmd='v-delete-domain';
            break;
        default: exit;
    }
}

foreach ($domain as $value) {
    $value = escapeshellarg($value);
    exec (VESTA_CMD.$cmd." ".$user." ".$value." no", $output, $return_var);
    $restart='yes';
}

if (isset($restart)) {
    exec (VESTA_CMD."v-restart-web", $output, $return_var);
    exec (VESTA_CMD."v-restart-proxy", $output, $return_var);
    exec (VESTA_CMD."v-restart-dns", $output, $return_var);
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
