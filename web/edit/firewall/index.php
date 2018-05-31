<?php
error_reporting(NULL);
ob_start();
$TAB = 'FIREWALL';

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check user
if ($_SESSION['user'] != 'admin') {
    header("Location: /list/user");
    exit;
}

// Check ip argument
if (empty($_GET['rule'])) {
    header("Location: /list/firewall/");
    exit;
}

// List rule
$v_rule = escapeshellarg($_GET['rule']);
exec (VESTA_CMD."v-list-firewall-rule ".$v_rule." 'json'", $output, $return_var);
check_return_code($return_var,$output);
$data = json_decode(implode('', $output), true);
unset($output);

// Parse rule
$v_rule = $_GET['rule'];
$v_action = $data[$v_rule]['ACTION'];
$v_protocol = $data[$v_rule]['PROTOCOL'];
$v_sport = $data[$v_rule]['SPORT'];
$v_dport = $data[$v_rule]['DPORT'];
$v_ip = $data[$v_rule]['IP'];
$v_comment = $data[$v_rule]['COMMENT'];
$v_date = $data[$v_rule]['DATE'];
$v_time = $data[$v_rule]['TIME'];
$v_suspended = $data[$v_rule]['SUSPENDED'];
if ( $v_suspended == 'yes' ) {
    $v_status =  'suspended';
} else {
    $v_status =  'active';
}

// Check POST request
if (!empty($_POST['save'])) {

    // Check token
    if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
        header('location: /login/');
        exit();
    }

    $v_rule = escapeshellarg($_GET['rule']);
    $v_action = escapeshellarg($_POST['v_action']);
    $v_protocol = escapeshellarg($_POST['v_protocol']);
    $v_sport = str_replace(" ",",", $_POST['v_sport']);
    $v_sport = preg_replace('/\,+/', ',', $v_sport);
    $v_sport = trim($v_sport, ",");
    $v_sport = escapeshellarg($v_sport);
    $v_dport = str_replace(" ",",", $_POST['v_dport']);
    $v_dport = preg_replace('/\,+/', ',', $v_dport);
    $v_dport = trim($v_dport, ",");
    $v_dport = escapeshellarg($v_dport);
    $v_ip = escapeshellarg($_POST['v_ip']);
    $v_comment = escapeshellarg($_POST['v_comment']);

    // Change Status
    exec (VESTA_CMD."v-change-firewall-rule ".$v_rule." ".$v_action." ".$v_ip." ".$v_sport." ".$v_dport." ".$v_protocol." ".$v_comment, $output, $return_var);
    check_return_code($return_var,$output);
    unset($output);

    $v_rule = $_GET['v_rule'];
    $v_action = $_POST['v_action'];
    $v_protocol = $_POST['v_protocol'];
    $v_sport = str_replace(" ",",", $_POST['v_sport']);
    $v_sport = preg_replace('/\,+/', ',', $v_sport);
    $v_sport = trim($v_sport, ",");
    $v_dport = str_replace(" ",",", $_POST['v_dport']);
    $v_dport = preg_replace('/\,+/', ',', $v_dport);
    $v_dport = trim($v_dport, ",");
    $v_ip = $_POST['v_ip'];
    $v_comment = $_POST['v_comment'];

    // Set success message
    if (empty($_SESSION['error_msg'])) {
        $_SESSION['ok_msg'] = __('Changes has been saved.');
    }
}

// Render page
render_page($user, $TAB, 'edit_firewall');

// Flush session messages
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
