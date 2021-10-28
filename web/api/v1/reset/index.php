<?php
session_start();
define('NO_AUTH_REQUIRED',true);
$TAB = 'RESET PASSWORD';

header('Content-Type: applcation/json');

if (isset($_SESSION['user'])) {
    // header("Location: /list/user");
}

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

if ((!empty($_POST['user'])) && (empty($_POST['code']))) {
    $v_user = escapeshellarg($_POST['user']);
    $user = $_POST['user'];
    $cmd="/usr/bin/sudo /usr/local/vesta/bin/v-list-user";
    exec ($cmd." ".$v_user." json", $output, $return_var);
    if ( $return_var == 0 ) {
        $data = json_decode(implode('', $output), true);
        $rkey = $data[$user]['RKEY'];
        $fname = $data[$user]['FNAME'];
        $lname = $data[$user]['LNAME'];
        $contact = $data[$user]['CONTACT'];
        $to = $data[$user]['CONTACT'];
        $subject = __('MAIL_RESET_SUBJECT',date("Y-m-d H:i:s"));
        $hostname = exec('hostname');
        $from = __('MAIL_FROM',$hostname);
        if (!empty($fname)) {
            $mailtext = __('GREETINGS_GORDON_FREEMAN',$fname,$lname);
        } else {
            $mailtext = __('GREETINGS');
        }
        $mailtext .= __('PASSWORD_RESET_REQUEST',$_SERVER['HTTP_HOST'],$user,$rkey,$_SERVER['HTTP_HOST'],$user,$rkey);
        if (!empty($rkey)) send_email($to, $subject, $mailtext, $from);
        unset($output);
    }

    // header("Location: /reset/?action=code&user=".$_POST['user']);
    exit;
}

if ((!empty($_POST['user'])) && (!empty($_POST['code'])) && (!empty($_POST['password'])) ) {
    if ( $_POST['password'] == $_POST['password_confirm'] ) {
        $v_user = escapeshellarg($_POST['user']);
        $user = $_POST['user'];
        $cmd="/usr/bin/sudo /usr/local/vesta/bin/v-list-user";
        exec ($cmd." ".$v_user." json", $output, $return_var);
        if ( $return_var == 0 ) {
            $data = json_decode(implode('', $output), true);
            $rkey = $data[$user]['RKEY'];
            if (hash_equals($rkey, $_POST['code'])) {
                $v_password = tempnam("/tmp","vst");
                $fp = fopen($v_password, "w");
                fwrite($fp, $_POST['password']."\n");
                fclose($fp);
                $cmd="/usr/bin/sudo /usr/local/vesta/bin/v-change-user-password";
                exec ($cmd." ".$v_user." ".$v_password, $output, $return_var);
                unlink($v_password);
                if ( $return_var > 0 ) {
                    $ERROR = "<a class=\"error\">".__('An internal error occurred')."</a>";
                } else {
                    $_SESSION['user'] = $_POST['user'];
                    // header("Location: /");
                    // exit;
                }
            } else {
                $ERROR = __('Invalid username or code');
            }
        } else {
            $ERROR = __('Invalid username or code');
        }
    } else {
        $ERROR = __('Passwords not match');
    }
}

// Detect language
if (empty($_SESSION['language'])) $_SESSION['language'] = detect_user_language();

$v_user = empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'];
top_panel($v_user, $TAB);

$result = array(
    'error' => $ERROR,
    'token' => empty($ERROR) ? $_SESSION['token'] : '',
    'panel' => $panel,
    'user' => $v_user,
    'session' => $_SESSION,
);

echo json_encode($result);
