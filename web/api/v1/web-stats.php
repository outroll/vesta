<?php
error_reporting(NULL);
$TAB = 'BACKUP';
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT'].'/inc/main.php');
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// List web stats
exec (VESTA_CMD."v-list-web-stats json", $output, $return_var);
$stats = json_decode(implode('', $output), true);
unset($output);

$result = array(
  'data' => $stats,
  'prefixI18N' => __('Prefix will be automaticaly added to username',$_SESSION['user']."_")
);

echo json_encode($result);
unset($stats);