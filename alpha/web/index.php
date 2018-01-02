<?php 
$vesta_installed=array(
	'initialVersion'=>'',
	'initialServer'=>'http://a.vesta.com'
);
define('VestaCP',json_encode($vesta_installed,true),true);
define('BasePath',realpath(dirname(__file__)).'/',true);
define('SystemPath',BasePath.'system/',true);
define('AppPath',BasePath.'system/',true);

require_once(SystemPath.'Core/VSystemCore.php');

