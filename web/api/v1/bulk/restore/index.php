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

$action = $_POST['action'];
$backup = escapeshellarg($_POST['backup']);

$web = 'no';
$dns = 'no';
$mail = 'no';
$db = 'no';
$cron = 'no';
$udir = 'no';

if (!empty($_POST['web'])) $web = escapeshellarg(implode(",",$_POST['web']));
if (!empty($_POST['dns'])) $dns = escapeshellarg(implode(",",$_POST['dns']));
if (!empty($_POST['mail'])) $mail = escapeshellarg(implode(",",$_POST['mail']));
if (!empty($_POST['db'])) $db = escapeshellarg(implode(",",$_POST['db']));
if (!empty($_POST['cron'])) $cron = 'yes';
if (!empty($_POST['udir'])) $udir = escapeshellarg(implode(",",$_POST['udir']));

if ($action == 'restore') {
    exec (VESTA_CMD."v-schedule-user-restore ".$user." ".$backup." ".$web." ".$dns." ".$mail." ".$db." ".$cron." ".$udir, $output, $return_var);
    if ($return_var == 0) {
        $_SESSION['error_msg'] = __('RESTORE_SCHEDULED');
    } else {
        $_SESSION['error_msg'] = implode('<br>', $output);
        if (empty($_SESSION['error_msg'])) {
            $_SESSION['error_msg'] = __('Error: vesta did not return any output.');
        }
        if ($return_var == 4) {
            $_SESSION['error_msg'] = __('RESTORE_EXISTS');
        }
    }
}

header('Content-Type: application/json');
$result = array(
    'error' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
  );
  
echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
