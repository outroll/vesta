<?php
error_reporting(NULL);
$TAB = 'FIREWALL';

header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check user
if ($_SESSION['user'] != 'admin') {
    exit;
}

// Data
exec (VESTA_CMD."v-list-firewall-ban json", $output, $return_var);
$data = json_decode(implode('', $output), true);
$data = array_reverse($data, true);
unset($output);

foreach ($data as $key => $value) {
	++$i;

    if ($data[$key]['SUSPENDED'] == 'yes') {
	    $data[$key]['status'] = 'suspended';
	    $data[$key]['suspend_action'] = 'unsuspend' ;
	    $data[$key]['suspend_conf'] = 'UNSUSPEND_RULE_CONFIRMATION' ;
	} else {
	    $data[$key]['status'] = 'active';
	    $data[$key]['suspend_action'] = 'suspend' ;
	    $data[$key]['suspend_conf'] = 'SUSPEND_RULE_CONFIRMATION' ;
	}

	$data[$key]['delete_url'] = '/delete/firewall/banlist/?ip='.$data[$key]['ip'].'&chain='.$data[$key]['CHAIN'].'&token='.$_SESSION['token'];
	$data[$key]['delete_confirmation'] = __('DELETE_IP_CONFIRMATION',$key);

	if ( $i == 1) {
	    $total_amount = __('1 rule');
	} else {
	    $total_amount = __('%s rules',$i);
	}
}

if ($i == 0) {
	$total_amount = __('There are no currently banned IP');
}

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$result = array(
	'data' => $data,
	'total_amount' => $total_amount
);

echo json_encode($result);
