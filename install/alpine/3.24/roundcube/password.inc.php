<?php

// Vesta Control Panel password plugin config -- see drivers/vesta.php
$config['password_driver'] = 'vesta';
$config['password_confirm_current'] = true;
$config['password_minimum_length'] = 6;
$config['password_log'] = false;
$config['password_login_exceptions'] = null;

// Vesta driver options
$config['password_vesta_host'] = 'localhost';
$config['password_vesta_port'] = '8083';
