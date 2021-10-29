<?php
error_reporting(NULL);
$TAB = 'BACKUP';

header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT'].'/inc/main.php');

// Data
exec (VESTA_CMD."v-list-user-backup-exclusions $user json", $output, $return_var);
$data = json_decode(implode('', $output), true);
unset($output);

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$result = array('data' => $data);

echo json_encode($result);
