<?php
$TAB = 'NOTIFICATIONS';
error_reporting(NULL);

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");


// Data
exec (VESTA_CMD."v-list-user-notifications $user json", $output, $return_var);
$notifications = json_decode(implode('', $output), true);
$notifications = array_reverse($notifications,true);
foreach($notifications as $key => $note){
    $note['ID'] = $key;
    $notifications[$key] = $note;
}

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$result = array(
    'result' => empty($notifications) ? [] : $notifications
);

echo json_encode($result);
