<?php
error_reporting(NULL);
$TAB = 'CRON';
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT'].'/inc/main.php');

top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// Data
exec (VESTA_CMD."v-list-cron-jobs $user json", $output, $return_var);
$data = json_decode(implode('', $output), true);
$data = array_reverse($data,true);
unset($output);

// Render page
// render_page($user, $TAB, 'list_cron');

if($panel[$user]['CRON_REPORTS'] == 'yes') {
  $cron_reports = __('turn off notifications');
} else {
  $cron_reports = __('turn on notifications');
}

foreach ($data as $key => $value) {
  ++$i;

  if ($data[$key]['SUSPENDED'] == 'yes') {
    $data[$key]['status'] = 'suspended';
    $data[$key]['suspend_action'] = 'unsuspend' ;
    $data[$key]['suspend_conf'] = __('UNSUSPEND_CRON_CONFIRMATION', $key);
  } else {
    $data[$key]['status'] = 'active';
    $data[$key]['suspend_action'] = 'suspend';
    $data[$key]['suspend_conf'] = __('SUSPEND_CRON_CONFIRMATION', $key);
  }

  $data[$key]['delete_conf'] = __('DELETE_CRON_CONFIRMATION', $key);

  if ( $i == 1) {
    $total_amount = __('1 cron job');
  } else {
    $total_amount = __('%s cron jobs', $i);
  }
}

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->totalAmount = $total_amount;
$object->cron_reports = $panel[$user]['CRON_REPORTS'];
$object->cron_fav = $_SESSION['favourites']['CRON'];

print json_encode($object);