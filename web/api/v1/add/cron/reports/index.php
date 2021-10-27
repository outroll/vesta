<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

$message = '';
$error = '';

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
	$error = 'Unathenticated.';
}

exec (VESTA_CMD."v-add-cron-reports ".$user, $output, $return_var);
$message = __('Cronjob email reporting has been successfully enabled');
unset($output);

$result = array(
	'message' => $message,
	'error' => $error
);

print json_encode($result);
