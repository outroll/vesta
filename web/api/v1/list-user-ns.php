<?php
error_reporting(NULL);
$TAB = 'BACKUP';
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT'].'/inc/main.php');
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// List users ns
exec (VESTA_CMD."v-list-user-ns ".$user." json", $output, $return_var);
$nameservers = json_decode(implode('', $output), true);
unset($output);

echo json_encode($nameservers);