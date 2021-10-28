<?php
// Init
error_reporting(NULL);
$TAB = 'SEARCH';
header('Content-Type: application/json');

$_SESSION['back'] = $_SERVER['REQUEST_URI'];

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check query
$q = $_GET['q'];
if (empty($q)) {
    $back=getenv("HTTP_REFERER");
    if (!empty($back)) {
        header("Location: ".$back);
        exit;
    }
    header("Location: /");
    exit;
}

// Data
$q = escapeshellarg($q);
$command = $_SESSION['user'] == 'admin'
           ? "v-search-object $q json"
           : "v-search-user-object $user $q json";

exec (VESTA_CMD . $command, $output, $return_var);
$data = json_decode(implode('', $output), true);


// Render page
// render_page($user, $TAB, 'list_search');

foreach ($data as $key => $value) {
    ++$i;

    if ($value['SUSPENDED'] == 'yes') {
        $data[$key]['status'] = __('suspended');
        $data[$key]['spnd_action'] = __('unsuspend');
    } else {
        $data[$key]['status'] = __('active');
        $data[$key]['spnd_action'] = __('suspend');
    }

    if ($value['TYPE'] == 'db') {
        $data[$key]['object'] = 'database';
    } else {
        $data[$key]['object'] = strtolower($value['TYPE'] . ' ' . $value['KEY']);
    }

    $uniq_id = $value['TYPE'] . '-';
    if ($value['KEY'] == 'ACCOUNT'){
      $uniq_id .= 'acc-';
    }    
    $uniq_id .= sha1($value['RESULT']);
    $data[$key]['uniq_id'] = $uniq_id;

    if ($value['KEY'] == 'RECORD') {
        $data[$key]['edit_link'] = '/edit/'.$value['TYPE'].'/?domain='.$value['PARENT'].'&record_id='.$value['LINK'].'&user='.$value['USER'];
    }
    if ($value['KEY'] == 'ACCOUNT') {
        $data[$key]['edit_link'] = '/edit/'.$value['TYPE'].'/?domain='.$value['PARENT'].'&account='.$value['LINK'].'&user='.$value['USER'];
    }
    if ($value['KEY'] == 'JOB') {
        $data[$key]['edit_link'] = '/edit/'.$value['TYPE'].'/?job='.$value['LINK'].'&user='.$value['USER'];
    }
    if ($value['KEY'] == 'DATABASE') {
        $data[$key]['edit_link'] = '/edit/'.$value['TYPE'].'/?database='.$value['RESULT'].'&user='.$value['USER'];
    }
    if (($value['KEY'] != 'RECORD') && ($value['KEY'] != 'ACCOUNT') && ($value['KEY'] != 'JOB') && ($value['KEY'] != 'DATABASE') ) {
        $data[$key]['edit_link'] = '/edit/'.$value['TYPE'].'/?'.strtolower($value['KEY']).'='.$value['RESULT'].'&user='.$value['USER'];
    }

    if ($value['KEY'] == 'RECORD') {
        $data[$key]['spnd_link'] = $spnd_action.'/'.$value['TYPE'].'/?domain='.$value['PARENT'].'&record_id='.$value['LINK'].'&user='.$value['USER'];
        $data[$key]['spnd_confirmation'] = __('SUSPEND_RECORD_CONFIRMATION', $key);
    }
    if ($value['KEY'] == 'ACCOUNT') {
        $data[$key]['spnd_link'] = $spnd_action.'/'.$value['TYPE'].'/?domain='.$value['PARENT'].'&account='.$value['LINK'].'&user='.$value['USER'];
        $data[$key]['spnd_confirmation'] = __('SUSPEND_USER_CONFIRMATION', $key);
    }
    if ($value['KEY'] == 'JOB') {
        $data[$key]['spnd_link'] = $spnd_action.'/'.$value['TYPE'].'/?job='.$value['LINK'].'&user='.$value['USER'];
        $data[$key]['spnd_confirmation'] = __('SUSPEND_CRON_CONFIRMATION', $key);
    }
    if ($value['KEY'] == 'DATABASE') {
        $data[$key]['spnd_link'] = $spnd_action.'/'.$value['TYPE'].'/?database='.$value['RESULT'].'&user='.$value['USER'];
        $data[$key]['spnd_confirmation'] = __('SUSPEND_DATABASE_CONFIRMATION', $key);
    }
    if (($value['KEY'] != 'RECORD') && ($value['KEY'] != 'ACCOUNT') && ($value['KEY'] != 'JOB') && ($value['KEY'] != 'DATABASE') ) {
        $data[$key]['spnd_link'] = $spnd_action.'/'.$value['TYPE'].'/?'.strtolower($value['KEY']).'='.$value['RESULT'].'&user='.$value['USER'];
        $data[$key]['spnd_confirmation'] = __('SUSPEND_DOMAIN_CONFIRMATION', $key);
    }

    if ($value['KEY'] == 'RECORD') {
        $data[$key]['delete_link'] = '/delete/'.$value['TYPE'].'/?domain='.$value['PARENT'].'&record_id='.$value['LINK'].'&user='.$value['USER'];
        $data[$key]['delete_confirmation'] = __('DELETE_RECORD_CONFIRMATION', $key);
    }
    if ($value['KEY'] == 'ACCOUNT') {
        $data[$key]['delete_link'] = '/delete/'.$value['TYPE'].'/?domain='.$value['PARENT'].'&account='.$value['LINK'].'&user='.$value['USER'];
        $data[$key]['delete_confirmation'] = __('DELETE_USER_CONFIRMATION', $key);
    }
    if ($value['KEY'] == 'JOB') {
        $data[$key]['delete_link'] = '/delete/'.$value['TYPE'].'/?job='.$value['LINK'].'&user='.$value['USER'];
        $data[$key]['delete_confirmation'] = __('DELETE_CRON_CONFIRMATION', $key);
    }
    if ($value['KEY'] == 'DATABASE') {
        $data[$key]['delete_link'] = '/delete/'.$value['TYPE'].'/?database='.$value['RESULT'].'&user='.$value['USER'];
        $data[$key]['delete_confirmation'] = __('DELETE_DATABASE_CONFIRMATION', $key);
    }
    if (($value['KEY'] != 'RECORD') && ($value['KEY'] != 'ACCOUNT') && ($value['KEY'] != 'JOB') && ($value['KEY'] != 'DATABASE') ) {
        $data[$key]['delete_link'] = '/delete/'.$value['TYPE'].'/?'.strtolower($value['KEY']).'='.$value['RESULT'].'&user='.$value['USER'];
        $data[$key]['delete_confirmation'] = __('DELETE_DOMAIN_CONFIRMATION', $key);
    }

    if ($value['TYPE'] == 'user') {
        if ($key == $user) {
            $data[$key]['logout_link'] = '/logout';
        } else {
            $data[$key]['login_as_link'] = '/login/?loginas='.$data[$key]['USER'];
        }

        $data[$key]['spnd_confirmation'] = $value['SUSPENDED'] == 'yes' ? __('UNSUSPEND_USER_CONFIRMATION', $value['USER']) : __('SUSPEND_USER_CONFIRMATION', $value['USER']);
        $data[$key]['delete_confirmation'] = __('DELETE_USER_CONFIRMATION', $value['USER']);
    }

    $data[$key]['ALIAS'] = str_replace(',', ', ', $value['ALIAS']);

    $data[$key]['STARRED'] = 0;
    if($_COOKIE[$uniq_id] == 1) {
        $data[$key]['STARRED'] = 1;
    }

    if ( $i == 1) {
        $total = __('1 object');
    } else {
        $total = __('%s objects',$i);
    }
}

$result = array(
	'data' => $data,
	'total' => isset($total) ? $total : __('%s objects', 0)
);

echo json_encode($result);
