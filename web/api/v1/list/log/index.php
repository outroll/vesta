<?php
error_reporting(NULL);
$TAB = 'LOG';

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);
header('Content-Type: application/json');

// Data
exec (VESTA_CMD."v-list-user-log $user json", $output, $return_var);
check_error($return_var);
$data = json_decode(implode('', $output), true);
$data = array_reverse($data);
unset($output);

foreach ($data as $key => $value) {
  ++$i;

  if ( $i == 1) {
    $total_amount = __('one log record');
  } else {
    $total_amount = __('%s log records',$i);
  }  
}

// Render page
// render_page($user, $TAB, 'list_log');

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->totalAmount = $total_amount;

print json_encode($object);