<?php
error_reporting(NULL);
$TAB = 'FIREWALL';

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);
header("Content-Type: application/json");

// Check user
if ($_SESSION['user'] != 'admin') {
    header("Location: /list/user");
    exit;
}

// Data
exec (VESTA_CMD."v-list-firewall json", $output, $return_var);
$data = json_decode(implode('', $output), true);
$data = array_reverse($data, true);
unset($output);

foreach ($data as $key => $value) {
  ++$i;

  if ($data[$key]['SUSPENDED'] == 'yes') {
    $data[$key]['status'] = 'suspended';
    $data[$key]['suspend_action'] = 'unsuspend' ;
    $data[$key]['suspend_conf'] = __('UNSUSPEND_RULE_CONFIRMATION', $key);
  } else {
    $data[$key]['status'] = 'active';
    $data[$key]['suspend_action'] = 'suspend';
    $data[$key]['suspend_conf'] = __('SUSPEND_RULE_CONFIRMATION', $key);
  }

  $data[$key]['delete_conf'] = __('DELETE_RULE_CONFIRMATION', $key);

  if ( $i == 1) {
    $total_amount =  __('1 rule');
  } else {
    $total_amount = __('%s rules', $i);
  }
}

// Render page
// render_page($user, $TAB, 'list_firewall');

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->totalAmount = $total_amount;
$object->firewallExtension = !empty($_SESSION['FIREWALL_EXTENSION']);
$object->firewallFav = $_SESSION['favourites']['FIREWALL'];

print json_encode($object);