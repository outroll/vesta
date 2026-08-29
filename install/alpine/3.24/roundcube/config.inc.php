<?php

$config = [];

$config['db_dsnw'] = 'mysql://roundcube:%password%@localhost/roundcube';
$config['imap_host'] = 'localhost:143';
$config['smtp_host'] = 'localhost:587';
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';
$config['support_url'] = '';
$config['product_name'] = 'Roundcube Webmail';
$config['des_key'] = '%des_key%';

$config['plugins'] = [
    'archive',
    'zipdownload',
    'password',
];

$config['skin'] = 'elastic';
