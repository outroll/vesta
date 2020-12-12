<?php
// Init
error_reporting(NULL);
session_start();
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_GET['token'])) || ($_SESSION['token'] != $_GET['token'])) {
    header('Location: /login/');
    exit();
}

$backup = basename($_GET['backup']);

// Check if the backup exists
if (!file_exists('/backup/'.$backup)) {
    exit(0);
}

// Data
if ($_SESSION['user'] == 'admin') {
    header('Content-type: application/gzip');
    header("Content-Disposition: attachment; filename=\"".$backup."\";" ); 
    header("X-Accel-Redirect: /backup/" . $backup);
}

if ((!empty($_SESSION['user'])) && ($_SESSION['user'] != 'admin')) {
    if (strpos($backup, $user.'.') === 0) {
        header('Content-type: application/gzip');
        header("Content-Disposition: attachment; filename=\"".$backup."\";" ); 
        header("X-Accel-Redirect: /backup/" . $backup);
    }
}
