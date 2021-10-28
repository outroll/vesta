<?php
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

$user = $_SESSION['user'];
if (($_SESSION['user'] == 'admin') && (!empty($_SESSION['look']))) {
    $user=$_SESSION['look'];
}

if (!empty($_REQUEST['path'])) {
    $path = htmlspecialchars($_REQUEST['path'], ENT_QUOTES, 'UTF-8');
    if (!empty($_REQUEST['raw'])) {
        header('content-type: image/jpeg');
        passthru (VESTA_CMD . "v-open-fs-file " . $user . " " . escapeshellarg($path));
        exit;
    }
}
else {
    die('File not found');
}
