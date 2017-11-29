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

// Check POST request
if (!empty($_POST['ok'])) {

    // Check empty fields
    if (empty($_POST['v_chain'])) $errors[] = __('banlist');
    if (empty($_POST['v_ipv6'])) $errors[] = __('ipv6 address');
    if (!empty($errors[0])) {
        foreach ($errors as $i => $error) {
            if ( $i == 0 ) {
                $error_msg = $error;
            } else {
                $error_msg = $error_msg.", ".$error;
            }
        }
        $_SESSION['error_msg'] = __('Field "%s" can not be blank.',$error_msg);
    }

    // Protect input
    $v_chain = escapeshellarg($_POST['v_chain']);
    $v_ipv6 = escapeshellarg($_POST['v_ipv6']);

    // Add firewall ban
    if (empty($_SESSION['error_msg'])) {
        exec (VESTA_CMD."v-add-firewall-ipv6-ban ".$v_ipv6." ".$v_chain, $output, $return_var);
        check_return_code($return_var,$output);
        unset($output);
    }

    // Flush field values on success
    if (empty($_SESSION['error_msg'])) {
        $_SESSION['ok_msg'] = __('BANLIST_CREATED_OK');
        unset($v_ip);
    }
}

// Render
render_page($user, $TAB, 'add_firewall_ipv6_banlist');

// Flush session messages
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
