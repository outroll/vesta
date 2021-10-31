
<?php
// Init
error_reporting(NULL);
ob_start();
session_start();
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

$v_username = escapeshellarg($user);
exec (VESTA_CMD."v-schedule-user-backup ".$v_username, $output, $return_var);
if ($return_var == 0) {
    $_SESSION['error_msg'] = __('BACKUP_SCHEDULED');
} else {
    $_SESSION['error_msg'] = implode('<br>', $output);
    if (empty($_SESSION['error_msg'])) {
        $_SESSION['error_msg'] = __('Error: vesta did not return any output.');
    }

    if ($return_var == 4) {
        $_SESSION['error_msg'] = __('BACKUP_EXISTS');
    }

}

$result = array(
    'ok' => $_SESSION['ok_msg'],
    'error' => $_SESSION['error_msg'],
);

echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
