<?php
header('Content-Type: application/json');

error_reporting(NULL);
define('NO_AUTH_REQUIRED', true);
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

if (empty($_SESSION['language'])) {
    $_SESSION['language'] = detect_user_language();
}

require_once($_SERVER['DOCUMENT_ROOT']."/inc/i18n/".$_SESSION['language'].".php");
$v_user = empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'];

top_panel($v_user, $TAB);

$result = array(
    'panel' => $panel,
    'data' => $panel[$v_user],
    'user' => $v_user,
    'token' => $_SESSION['token'],
    'i18n' => $LANG[$_SESSION['language']],
    'session' => $_SESSION,
    'error' => $_SESSION['error_msg']
);

echo json_encode($result);
