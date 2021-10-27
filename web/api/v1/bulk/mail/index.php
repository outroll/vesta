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
$account = $_POST['account'];
$action = $_POST['action'];

if ($_SESSION['user'] == 'admin') {
    if (empty($account)) {
        switch ($action) {
            case 'delete': $cmd='v-delete-mail-domain';
                break;
            case 'suspend': $cmd='v-suspend-mail-domain';
                break;
            case 'unsuspend': $cmd='v-unsuspend-mail-domain';
                break;
            default: exit;
        }
    } else {
        switch ($action) {
            case 'delete': $cmd='v-delete-mail-account';
                break;
            case 'suspend': $cmd='v-suspend-mail-account';
                break;
            case 'unsuspend': $cmd='v-unsuspend-mail-account';
                break;
            default: exit;
        }
    }
} else {
    if (empty($account)) {
        switch ($action) {
            case 'delete': $cmd='v-delete-mail-domain';
                break;
            default: exit;
        }
    } else {
        switch ($action) {
            case 'delete': $cmd='v-delete-mail-account';
                break;
            default: exit;
        }
    }
}


if (empty($account)) {
    foreach ($domain as $value) {
        // Mail
        $value = escapeshellarg($value);
        exec (VESTA_CMD.$cmd." ".$user." ".$value, $output, $return_var);
        $restart = 'yes';
    }
} else {
    foreach ($account as $value) {
        // Mail Account
        $value = escapeshellarg($value);
        $dom = escapeshellarg($domain);
        exec (VESTA_CMD.$cmd." ".$user." ".$dom." ".$value, $output, $return_var);
        $restart = 'yes';
    }
}

$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
