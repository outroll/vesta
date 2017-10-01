<?php
error_reporting(NULL);
ob_start();
$TAB = 'PLUGIN';

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check user
if ($_SESSION['user'] != 'admin') {
    header("Location: /list/user");
    exit;
}

// Check POST request
if (!empty($_POST['ok'])) {

    // Check token
    if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
        header('location: /login/');
        exit();
    }

    // Check empty fields
    if (empty($_POST['v_plugin'])) $errors[] = __('plugin');
    if (empty($_POST['v_key'])) $errors[] = __('key');
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
    $v_plugin = escapeshellarg($_POST['v_plugin']);
    $v_key = escapeshellarg($_POST['v_key']);

    // Add firewall rule
    if (empty($_SESSION['error_msg'])) {
        //exec (VESTA_CMD."v-add-plugin ".$v_plugin." ".$v_key, $output, $return_var);
        check_return_code($return_var,$output);
        unset($output);
    }

    // Flush field values on success
    if (empty($_SESSION['error_msg'])) {
        $_SESSION['ok_msg'] = __('Plugin added');
        unset($v_port);
        unset($v_ip);
        unset($v_comment);
    }
}

// Render
render_page($user, $TAB, 'add_plugin');

// Flush session messages
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
