<?
error_reporting(NULL);
$TAB = 'MAIL';
header("Content-Type: application/json");

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Data & Render page
if (empty($_GET['domain'])){
    exec (VESTA_CMD."v-list-mail-domains $user json", $output, $return_var);
    $data = json_decode(implode('', $output), true);
    $data = array_reverse($data, true);
    unset($output);

    $favorites = $_SESSION['favourites']['MAIL'];

    // render_page($user, $TAB, 'list_mail');
} else {
    exec (VESTA_CMD."v-list-mail-accounts ".$user." ".escapeshellarg($_GET['domain'])." json", $output, $return_var);
    $data = json_decode(implode('', $output), true);
    $data = array_reverse($data, true);
    unset($output);

    $favorites = $_SESSION['favourites']['MAIL_ACC'];

    // render_page($user, $TAB, 'list_mail_acc');
}

$uname_arr=posix_uname();
$hostname=$uname_arr['nodename'];

top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

foreach ($data as $key => $value) {
  ++$i;

  list($http_host, $port) = explode(':', $_SERVER["HTTP_HOST"].":");
  $webmail = "/webmail/";
  if (!empty($_SESSION['MAIL_URL'])) $webmail = $_SESSION['MAIL_URL'];

  if ($data[$key]['SUSPENDED'] == 'yes') {
    $data[$key]['status'] = 'suspended';
    $data[$key]['suspend_action'] = 'unsuspend' ;
    $data[$key]['suspend_conf'] = __('UNSUSPEND_DOMAIN_CONFIRMATION', $key);
  } else {
    $data[$key]['status'] = 'active';
    $data[$key]['suspend_action'] = 'suspend';
    $data[$key]['suspend_conf'] = __('SUSPEND_DOMAIN_CONFIRMATION', $key);
  }

  if (empty($data[$key]['CATCHALL'])) {
    $data[$key]['CATCHALL'] = '/dev/null';
  }

  if (empty($_GET['domain'])){
  	$total_amount = $i === 1 ? __('1 domain') : __('%s domains', $i);
  } else {
  	$total_amount = $i === 1 ?  __('1 mail account') : __('%s mail account', $i);
  }

  $data[$key]['list_accounts_button'] = __('list accounts', $data[$key]['ACCOUNTS']);
  $data[$key]['delete_conf'] = __('DELETE_DOMAIN_CONFIRMATION', $key);
}

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->webmail = $webmail;
$object->hostname = $hostname;
$object->totalAmount = $total_amount;
$object->mailFav = $favorites;

print json_encode($object);