<?php
error_reporting(NULL);
$TAB = 'PACKAGE';
header("Content-Type: application/json");

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// Check user
if ($_SESSION['user'] != 'admin') {
    header("Location: /list/user");
    exit;
}

// Data
exec (VESTA_CMD."v-list-user-packages json", $output, $return_var);
$data = json_decode(implode('', $output), true);
unset($output);

foreach ($data as $key => $value) {
  ++$i;
  if ( $i == 1) {
    $total_amount = __('1 package');
  } else {
    $total_amount = __('%s packages',$i);
  }
  
  $data[$key]['delete_conf'] = __('DELETE_PACKAGE_CONFIRMATION', $key);
}

// Render page
// render_page($user, $TAB, 'list_packages');

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->totalAmount = $total_amount;
$object->packagesFav = $_SESSION['favourites']['PACKAGE'];

print json_encode($object);