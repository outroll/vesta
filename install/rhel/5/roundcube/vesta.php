<?php

/**
 * DevIT Control Panel Password Driver
 *
 * @version 1.0
 * @author Serghey Rodin <skid@devitcp.com>
 */

class rcube_devit_password
{
    function save($curpass, $passwd)
    {
        $rcmail = rcmail::get_instance();
        $devit_host = $rcmail->config->get('password_devit_host');

        if (empty($devit_host))
        {
            $devit_host = 'localhost';
        }

        $devit_port = $rcmail->config->get('password_devit_port');
        if (empty($devit_port))
        {
            $devit_port = '8083';
        }

        $postvars = array(
          'email' => $_SESSION['username'],
          'password' => $curpass,
          'new' => $passwd
        );

        $postdata = http_build_query($postvars);

        $send  = 'POST /reset/mail/ HTTP/1.1' . PHP_EOL;
        $send .= 'Host: ' . $devit_host . PHP_EOL;
        $send .= 'User-Agent: PHP Script' . PHP_EOL;
        $send .= 'Content-length: ' . strlen($postdata) . PHP_EOL;
        $send .= 'Content-type: application/x-www-form-urlencoded' . PHP_EOL;
        $send .= 'Connection: close' . PHP_EOL;
        $send .= PHP_EOL;
        $send .= $postdata . PHP_EOL . PHP_EOL;

        $fp = fsockopen('ssl://' . $devit_host, $devit_port);
        fputs($fp, $send);
        $result = fread($fp, 2048);
        fclose($fp);

        if(strpos($result, 'ok') && !strpos($result, 'error'))
        {
            return PASSWORD_SUCCESS;
        }
        else {
            return PASSWORD_ERROR;
        }

    }
}
