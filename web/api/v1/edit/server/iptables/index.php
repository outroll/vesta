<?php
error_reporting(NULL);
$TAB = 'SERVER';
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

$result = array(
  'error' => $_SESSION['error_msg'],
  'ok_msg' => $_SESSION['ok_msg']
);

echo json_encode($result);
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);