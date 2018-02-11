<?php
// Main include
include($_SERVER['DOCUMENT_ROOT']."/api/index.php");

// Display debugger information
$debugger = false;

if (!empty($_GET['debug']) || !empty($_POST['debug'])) {
    $debugger = true;
    echo "<pre>";
}

// Refuse connections that are not running on HTTPS
if ((empty($_SERVER['HTTPS'])) || ($_SERVER['HTTPS'] == 'off')) {
    if ($debugger) {
        echo "HTTPS is required to use this API.";
    }
    die();
}

// Retrieve and sanatize incoming POST variables
if (!empty($_POST['user']) && !empty($_POST['id']) && !empty($_POST['key'])) {
    $user = escapeshellarg($_POST['user']);
    $id = escapeshellarg($_POST['id']);
    $key = escapeshellarg($_POST['key']);
    
// Retrieve and sanatize incoming GET variables
} elseif (!empty($_GET['user']) && !empty($_GET['id']) && !empty($_GET['key'])) {
    $user = escapeshellarg($_GET['user']);
    $id = escapeshellarg($_GET['id']);
    $key = escapeshellarg($_GET['key']);
}

// Verify all fields are completed
if (empty($user) || empty($id) || empty($key)) {
    if ($debugger) {
        echo "Authentication values are missing.";
    }
    die();
}

// Authenticate API key
exec (VESTA_CMD."v-authenticate-ddns-key ".$user." ".$id." ".$key." json", $output, $return_var);
$data = json_decode(implode('', $output), true);
unset($output);

// Verify successful authentication
if (!$data) {
    if ($debugger) {
        echo "Access denied.";
    }
    die();
}

// Get DDNS id.
$id = escapeshellarg(key($data));

// Get IP address of remote system
$ip_address = $_SERVER['REMOTE_ADDR'];
if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
    $ip_address = array_pop(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
}

// Sanatize variables
$new_ip = escapeshellarg($ip_address);

// Change DNS record
exec (VESTA_CMD."v-change-dns-record-by-ddns ".$user." ". $id ." ".$new_ip, $output, $return_var);
if ($debugger) {
    print_r($output);
}
unset($output);

// Output success message.
if ($debugger) {
    echo 'Complete! Attempted to set set record to ip address: ' . $new_ip;
    echo '</pre>';
}
