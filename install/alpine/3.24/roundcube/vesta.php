<?php

/**
 * Vesta Control Panel Password Driver
 *
 * @author Serghey Rodin <skid@vestacp.com>
 */
class rcube_vesta_password
{
    public function save($curpass, $passwd, $username = null)
    {
        $rcmail = rcmail::get_instance();
        $vesta_host = $rcmail->config->get('password_vesta_host');
        if (empty($vesta_host)) {
            $vesta_host = 'localhost';
        }

        $vesta_port = $rcmail->config->get('password_vesta_port');
        if (empty($vesta_port)) {
            $vesta_port = '8083';
        }

        if (empty($username)) {
            $username = $_SESSION['username'];
        }

        $postvars = [
            'email' => $username,
            'password' => $curpass,
            'new' => $passwd,
        ];

        $postdata = http_build_query($postvars);

        $send = 'POST /reset/mail/ HTTP/1.1' . PHP_EOL;
        $send .= 'Host: ' . $vesta_host . PHP_EOL;
        $send .= 'User-Agent: PHP Script' . PHP_EOL;
        $send .= 'Content-length: ' . strlen($postdata) . PHP_EOL;
        $send .= 'Content-type: application/x-www-form-urlencoded' . PHP_EOL;
        $send .= 'Connection: close' . PHP_EOL;
        $send .= PHP_EOL;
        $send .= $postdata . PHP_EOL . PHP_EOL;

        $context = stream_context_create();
        stream_context_set_option($context, 'ssl', 'verify_peer', false);
        stream_context_set_option($context, 'ssl', 'verify_peer_name', false);
        stream_context_set_option($context, 'ssl', 'allow_self_signed', true);

        $errno = 0;
        $errstr = '';
        $fp = stream_socket_client('ssl://' . $vesta_host . ':' . $vesta_port, $errno, $errstr, 60, STREAM_CLIENT_CONNECT, $context);
        if (!$fp) {
            return PASSWORD_CONNECT_ERROR;
        }

        fputs($fp, $send);
        $result = fread($fp, 2048);
        fclose($fp);

        if (strpos($result, 'ok') !== false && strpos($result, 'error') === false) {
            return PASSWORD_SUCCESS;
        }

        return PASSWORD_ERROR;
    }
}
