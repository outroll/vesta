<?php
error_reporting(NULL);
$TAB = 'BACKUP';
header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT'].'/inc/main.php');
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// Data & Render page
if (empty($_GET['backup'])){
  exec (VESTA_CMD."v-list-user-backups $user json", $output, $return_var);
  $data = json_decode(implode('', $output), true);
  $data = array_reverse($data,true);
  unset($output);

  // render_page($user, $TAB, 'list_backup');
} else {
  exec (VESTA_CMD."v-list-user-backup $user ".escapeshellarg($_GET['backup'])." json", $output, $return_var);
  $data = json_decode(implode('', $output), true);
  $data = array_reverse($data,true);
  unset($output);

  // render_page($user, $TAB, 'list_backup_detail');
}

$backup = $_GET['backup'];

foreach ($data as $key => $value) {
  ++$i;
  $web = __('no');
  $dns = __('no');
  $mail = __('no');
  $db = __('no');
  $cron = __('no');
  $udir = __('no');

  if (!empty($data[$key]['WEB'])) $web = __('yes');
  if (!empty($data[$key]['DNS'])) $dns = __('yes');
  if (!empty($data[$key]['MAIL'])) $mail = __('yes');
  if (!empty($data[$key]['DB'])) $db = __('yes');
  if (!empty($data[$key]['CRON'])) $cron = __('yes');
  if (!empty($data[$key]['UDIR'])) $udir = __('yes');

  $data[$key]['delete_conf'] = __('DELETE_BACKUP_CONFIRMATION', $key);

	if (empty($_GET['backup'])){
		if ( $i == 1) {
			$total_amount = __('1 archive');
		} else {
			$total_amount = __('%s archives',$i);
		}
	} else {
		$webAr = explode(',',$data[$backup]['WEB']);
		$dnsAr = explode(',',$data[$backup]['DNS']);
		$mailAr = explode(',',$data[$backup]['MAIL']);
		$dbAr = explode(',',$data[$backup]['DB']);
		$cronAr = explode(',',$data[$backup]['CRON']);
		$udirAr = explode(',',$data[$backup]['UDIR']);

		$totalLength = count($webAr) + count($dnsAr) + count($mailAr) + count($dbAr) + count($cronAr) + count($udirAr);

		$total_amount = __('%s items', $totalLength);
	}
}

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->totalAmount = $total_amount;
$object->backup_fav = $_SESSION['favourites']['BACKUP'];

print json_encode($object);