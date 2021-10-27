<?php

header('Content-Type: application/json');
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
require_once($_SERVER['DOCUMENT_ROOT'].'/inc/i18n/'.$_SESSION['language'].'.php');
session_start();

$response = '';

if (!empty($_SESSION['look'])) {
	unset($_SESSION['look']);
	$response = 'logged_out_as';
	$v_user = empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'];
	top_panel($v_user, $TAB);
	exec (VESTA_CMD . "v-list-user ".$v_user." json", $output, $return_var);
    $users = json_decode(implode('', $output), true);
} else {
	$response = 'logged_out';
    session_destroy();
}

$result = array(
	'logout_response' => $response,
	'userName' => $v_user,
	'token' => $_SESSION['token'],
	'user' => $users[$v_user],
	'panel' => $panel,
	'session' => $_SESSION,
	'i18n' => $LANG[$_SESSION['language']],
  'error' => $_SESSION['error_msg']
);

echo json_encode($result);
unset($_SESSION['error_msg']);
