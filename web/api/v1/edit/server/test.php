<?php
error_reporting(0);
$TAB = 'SERVER';

header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Change port
exec (VESTA_CMD."v-change-vesta-port ".escapeshellarg('8087'), $output, $return_var);
check_return_code($return_var,$output);
unset($output);

header('Location: '
    . ($_SERVER['HTTPS'] ? 'https' : 'http')
    . '://' . $_SERVER['HTTP_HOST'] . ':' . '8087');
exit;
