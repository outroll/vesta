<?php
error_reporting(NULL);
$TAB = 'SERVER';

header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check user
if ($_SESSION['user'] != 'admin') {
    exit;
}

// Check POST request
if (!empty($_POST['save'])) {

    // Check token
    if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
        exit();
    }

    // Set restart flag
    $v_restart = 'yes';
    if (empty($_POST['v_restart'])) $v_restart = 'no';

    // Update config
    if (!empty($_POST['v_config'])) {
        exec ('mktemp', $mktemp_output, $return_var);
        $new_conf = $mktemp_output[0];
        $fp = fopen($new_conf, 'w');
        fwrite($fp, str_replace("\r\n", "\n",  $_POST['v_config']));
        fclose($fp);
        exec (VESTA_CMD."v-change-sys-service-config ".$new_conf." php ".$v_restart, $output, $return_var);
        check_return_code($return_var,$output);
        unset($output);
        unlink($new_conf);
    }

    // Set success message
    if (empty($_SESSION['error_msg'])) {
        $_SESSION['ok_msg'] = __('Changes has been saved.');
    }

}

// List config
exec (VESTA_CMD."v-list-sys-php-config json", $output, $return_var);
$data = json_decode(implode('', $output), true);
unset($output);
$v_memory_limit = $data['CONFIG']['memory_limit'];
$v_max_execution_time = $data['CONFIG']['max_execution_time'];
$v_max_input_time = $data['CONFIG']['max_input_time'];
$v_upload_max_filesize = $data['CONFIG']['upload_max_filesize'];
$v_post_max_size = $data['CONFIG']['post_max_size'];
$v_display_errors = $data['CONFIG']['display_errors'];
$v_error_reporting = $data['CONFIG']['error_reporting'];
$v_config_path = $data['CONFIG']['config_path'];

# Read config
$v_config = shell_exec(VESTA_CMD."v-open-fs-config ".$v_config_path);

$result = array(
    'memory_limit' => $data['CONFIG']['memory_limit'],
    'max_execution_time' => $data['CONFIG']['max_execution_time'],
    'max_input_time' => $data['CONFIG']['max_input_time'],
    'upload_max_filesize' => $data['CONFIG']['upload_max_filesize'],
    'post_max_size' => $data['CONFIG']['post_max_size'],
    'display_errors' => $data['CONFIG']['display_errors'],
    'error_reporting' => $data['CONFIG']['error_reporting'],
    'config_path' => $data['CONFIG']['config_path'],
    'web_system' => $_SESSION['WEB_SYSTEM'],
    'config' => $v_config,
    'error_msg' => $_SESSION['error_msg'],
    'ok_msg' => $_SESSION['ok_msg']
);

echo json_encode($result);

// Flush session messages
unset($_SESSION['error_msg']);
unset($_SESSION['ok_msg']);
