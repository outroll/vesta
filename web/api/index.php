<?php
define('VESTA_CMD', '/usr/bin/sudo /usr/local/vesta/bin/');

if (isset($_POST['user']) || isset($_POST['hash'])) {

    // Authentication
    $auth_code = 1;
    if (empty($_POST['hash'])) {
        $v_user = escapeshellarg($_POST['user']);

        // Send password via tmp file
        $v_password = exec('mktemp -p /tmp');
        $fp = fopen($v_password, "w");
        fwrite($fp, $_POST['password']."\n");
        fclose($fp);

        // Check user & password
        exec(VESTA_CMD ."v-check-user-password ".$v_user." ".$v_password." ".escapeshellarg($_SERVER['REMOTE_ADDR']),  $output, $auth_code);
        unset($output);

        // Remove tmp file
        unlink($v_password);

        // Check is user admin user
        exec (VESTA_CMD . "v-check-user-admin ".$v_user, $output, $return_var);
        unset($output);

        // Check API answer
        if ( $return_var == 0 ) $v_user = 'admin';

        // Check user permission to use API
        if ($v_user != 'admin') {
            echo 'Error: only admin is allowed to use API';
            exit;
        }
    } else {
        $key = '/usr/local/vesta/data/keys/' . basename($_POST['hash']);
        if (file_exists($key) && is_file($key)) {
            $auth_code = '0';
        }
    }

    if ($auth_code != 0 ) {
        echo 'Error: authentication failed';
        exit;
    }

    // Define the command to use
    if (isset($_POST['cmd']))
    {
        $cmd = escapeshellarg($_POST['cmd']);
    } else
    {
        // If there's no command, just exit.
        echo 'No command specified.';
        exit;
    }

    // Prepare for iteration
    $args = [];
    $i = 0;

    // Loop through args until there isn't another.
    while (true)
    {
        $i++;
        if (!empty($_POST['arg' . $i]))
        {
            $args[] = escapeshellarg($_POST['arg' . $i]);
            continue;
        }
        break;
    }

    // Build query
    $cmdquery = VESTA_CMD . $cmd . " " . implode(" ", $args);

    // Check command
    if ($cmd == "'v-make-tmp-file'") {
        // Used in DNS Cluster
        $fp = fopen($_POST['arg2'], 'w');
        fwrite($fp, $_POST['arg1']."\n");
        fclose($fp);
        $return_var = 0;
    } else {
        // Run normal cmd query
        exec ($cmdquery, $output, $return_var);
    }

    if ((!empty($_POST['returncode'])) && ($_POST['returncode'] == 'yes')) {
        echo $return_var;
    } else {
        if (($return_var == 0) && (empty($output))) {
            echo "OK";
        } else {
            echo implode("\n",$output)."\n";
        }
    }
}
