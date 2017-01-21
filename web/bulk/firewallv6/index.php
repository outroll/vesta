<?php
// Init
error_reporting(NULL);
ob_start();
session_start();

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
    header('location: /login/');
    exit();
}

// Check user
if ($_SESSION['user'] != 'admin') {
    header("Location: /list/user");
    exit;
}


$rule = $_POST['rule'];
$action = $_POST['action'];

switch ($action) {
    case 'delete': $cmd='v-delete-firewall-ipv6-rule';
        break;
    case 'suspend': $cmd='v-suspend-firewall-ipv6-rule';
        break;
    case 'unsuspend': $cmd='v-unsuspend-firewall-ipv6-rule';
        break;
    default: header("Location: /list/firewallv6/"); exit;
}

foreach ($rule as $value) {
    $value = escapeshellarg($value);
    exec (VESTA_CMD.$cmd." ".$value, $output, $return_var);
    $restart = 'yes';
}

header("Location: /list/firewall/");
