<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
header('Content-Type: application/json');
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

$message = '';
$error = '';

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
	$error = 'Unauthenticated';
}

if ($_SESSION['user'] == 'admin') {
    exec (VESTA_CMD."v-delete-cron-vesta-autoupdate", $output, $return_var);
    $message = __('Autoupdate has been successfully disabled');
    unset($output);
}

$result = array(
	'message' => $message,
	'error' => $error
);

print json_encode($result);
