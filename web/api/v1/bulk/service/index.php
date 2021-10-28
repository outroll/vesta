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

$service = $_POST['service'];
$action = $_POST['action'];

if ($_SESSION['user'] == 'admin') {
    switch ($action) {
        case 'stop': $cmd='v-stop-service';
            break;
        case 'start': $cmd='v-start-service';
            break;
        case 'restart': $cmd='v-restart-service';
            break;
        default: exit;
    }

    if ((!empty($_POST['system'])) && ($action == 'restart')) {
        exec (VESTA_CMD."v-restart-system yes", $output, $return_var);
        $_SESSION['error_srv'] = 'The system is going down for reboot NOW!';
        unset($output);
        exit;
    }

    foreach ($service as $value) {
        $value = escapeshellarg($value);
        exec (VESTA_CMD.$cmd." ".$value, $output, $return_var);
    }
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
