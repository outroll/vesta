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
$record = $_POST['record'];
$action = $_POST['action'];

if ($_SESSION['user'] == 'admin') {
    if (empty($record)) {
        switch ($action) {
            case 'delete': $cmd='v-delete-dns-domain';
                break;
            case 'suspend': $cmd='v-suspend-dns-domain';
                break;
            case 'unsuspend': $cmd='v-unsuspend-dns-domain';
                break;
            default: exit;
        }
    } else {
        switch ($action) {
            case 'delete': $cmd='v-delete-dns-record';
                break;
            case 'suspend': $cmd='v-suspend-dns-record';
                break;
            case 'unsuspend': $cmd='v-unsuspend-dns-record';
                break;
            default: exit;
        }
    }
} else {
    if (empty($record)) {
        switch ($action) {
            case 'delete': $cmd='v-delete-dns-domain';
                break;
            default: exit;
        }
    } else {
        switch ($action) {
            case 'delete': $cmd='v-delete-dns-record';
                break;
            default: exit;
        }
    }
}


if (empty($record)) {
    foreach ($domain as $value) {
        // DNS
        $value = escapeshellarg($value);
        exec (VESTA_CMD.$cmd." ".$user." ".$value." no", $output, $return_var);
        $restart = 'yes';
    }
} else {
    foreach ($record as $value) {
        // DNS Record
        $value = escapeshellarg($value);
        $dom = escapeshellarg($domain);
        exec (VESTA_CMD.$cmd." ".$user." ".$dom." ".$value." no", $output, $return_var);
        $restart = 'yes';
    }
}

if (!empty($restart)) {
    exec (VESTA_CMD."v-restart-dns", $output, $return_var);
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
