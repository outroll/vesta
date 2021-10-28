<?php
error_reporting(NULL);
$TAB = 'DNS';
header("Content-Type: application/json");

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// Data & Render page
if (empty($_GET['domain'])){
    exec (VESTA_CMD."v-list-dns-domains $user json", $output, $return_var);
    $data = json_decode(implode('', $output), true);
    $data = array_reverse($data, true);
    unset($output);

    // render_page($user, $TAB, 'list_dns');
} else {
    exec (VESTA_CMD."v-list-dns-records ".$user." ".escapeshellarg($_GET['domain'])." json", $output, $return_var);
    $data = json_decode(implode('', $output), true);
    $data = array_reverse($data, true);
    unset($output);

    // render_page($user, $TAB, 'list_dns_rec');
}

foreach ($data as $key => $value) {
  ++$i;

  if ( $i == 1) {
    $total_amount = __('1 domain');
  } else {
    $total_amount = __('%s domains', $i);
  }

  if (!empty($_GET['domain'])){
    if ( $i == 1) {
      $total_amount = __('1 record');
    } else {
      $total_amount = __('%s records',$i);
    }

      $data[$key]['delete_conf'] = __('DELETE_RECORD_CONFIRMATION', $data[$key]['RECORD']);
  } else {
      $data[$key]['delete_conf'] = __('DELETE_DOMAIN_CONFIRMATION', $key);
  }

  if ($data[$key]['SUSPENDED'] == 'yes') {
    $data[$key]['status'] = 'suspended';
    $data[$key]['suspend_action'] = 'unsuspend' ;
    $data[$key]['suspend_conf'] = !empty($_GET['domain']) ? __('UNSUSPEND_RECORD_CONFIRMATION', $data[$key]['RECORD']) : __('UNSUSPEND_DOMAIN_CONFIRMATION', $key);
  } else {
    $data[$key]['status'] = 'active';
    $data[$key]['suspend_action'] = 'suspend';
    $data[$key]['suspend_conf'] = !empty($_GET['domain']) ? __('SUSPEND_RECORD_CONFIRMATION', $data[$key]['RECORD']) : __('SUSPEND_DOMAIN_CONFIRMATION', $key);
  }

  $data[$key]['RECORDS_I18N'] = __('list records', $data[$key]['RECORDS']);
}

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->totalAmount = $total_amount;
$object->dnsFav = $_SESSION['favourites']['DNS'];
$object->dnsRecordsFav = $_SESSION['favourites']['DNS_REC'];

print json_encode($object);