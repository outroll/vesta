<?php
error_reporting(NULL);
$TAB = 'SERVER';

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
header("Content-Type: application/json");
top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// Check user
if ($_SESSION['user'] != 'admin') {
    header("Location: /list/user");
    exit;
}

// CPU info
if (isset($_GET['cpu'])) {
    $TAB = 'CPU';
    exec (VESTA_CMD.'v-list-sys-cpu-status', $output, $return_var);
    $service_log = $output;
}

// Memory info
if (isset($_GET['mem'])) {
    $TAB = 'MEMORY';
    exec (VESTA_CMD.'v-list-sys-memory-status', $output, $return_var);
    $service_log = $output;
}

// Disk info
if (isset($_GET['disk'])) {
    $TAB = 'DISK';
    exec (VESTA_CMD.'v-list-sys-disk-status', $output, $return_var);
    $service_log = $output;
}

// Network info
if (isset($_GET['net'])) {
    $TAB = 'NETWORK';
    exec (VESTA_CMD.'v-list-sys-network-status', $output, $return_var);
    $service_log = $output;
}

// Web info
if (isset($_GET['web'])) {
    $TAB = 'WEB';
    exec (VESTA_CMD.'v-list-sys-web-status', $output, $return_var);
    $service_log = $output;
}


// DNS info
if (isset($_GET['dns'])) {
    $TAB = 'DNS';
    exec (VESTA_CMD.'v-list-sys-dns-status', $output, $return_var);
    $service_log = $output;
}

// Mail info
if (isset($_GET['mail'])) {
    $TAB = 'MAIL';
    exec (VESTA_CMD.'v-list-sys-mail-status', $output, $return_var);
    $service_log = $output;
}

// DB info
if (isset($_GET['db'])) {
    $TAB = 'DB';
    exec (VESTA_CMD.'v-list-sys-db-status', $output, $return_var);
    $service_log = $output;
}

// Data
exec (VESTA_CMD."v-list-sys-info json", $output, $return_var);
$sys = json_decode(implode('', $output), true);
unset($output);
exec (VESTA_CMD."v-list-sys-services json", $output, $return_var);
$data = json_decode(implode('', $output), true);
unset($output);

foreach ($data as $key => $value) {
	if ($data[$key]['STATE'] == 'running') {
		$data[$key]['action_url'] = '/stop/service/?srv='.$key;
	} else {
		$data[$key]['action_url'] = '/start/service/?srv='.$key;
	}

	$data[$key]['SYSTEM'] = __($data[$key]['SYSTEM']);
	$data[$key]['RTIME'] = humanize_time($data[$key]['RTIME']);

	$cpu = $data[$key]['CPU'] / 10;
    $data[$key]['CPU'] = number_format($cpu, 1);
    if ($cpu == '0.0')  $data[$key]['CPU'] = 0;
}

foreach ($sys as $key => $value) {
	$sys[$key]['UPTIME'] = humanize_time($sys[$key]['UPTIME']);
}

// Render page
// render_page($user, $TAB, 'list_services');

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->sys = $sys;
$object->service_log = $service_log;
$object->panel = $panel;

print json_encode($object);