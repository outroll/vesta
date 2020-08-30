<?php

$myvesta_current_user=exec('whoami', $myvesta_output, $myvesta_return_var);
if ($myvesta_current_user != 'root') {echo "ERROR: You must be root to execute this script\n"; exit(1);}

$myvesta_exit_on_error=true;
define('MYVESTA_ERROR_PERMISSION_DENIED', 1);
define('MYVESTA_ERROR_MISSING_ARGUMENTS', 2);
define('MYVESTA_ERROR_FILE_DOES_NOT_EXISTS', 3);
define('MYVESTA_ERROR_STRING_DOES_NOT_EXISTS', 4);

function myvesta_throw_error($code, $message) {
    global $myvesta_exit_on_error;
    echo "ERROR: ".$message."\n";
    if ($myvesta_exit_on_error) myvesta_exit($code);
    return $code;
}

function myvesta_fix_backslashes($s) {
	$s=str_replace("\\n", "\n", $s);
	$s=str_replace("\\r", "\r", $s);
	$s=str_replace("\\t", "\t", $s);
	return $s;
}

function myvesta_check_args ($requried_arguments, $arguments) {
    global $argv;
    $argument_counter=count($argv);
    $argument_counter--;
    $argv[0]=str_replace('/usr/local/vesta/bin/', '', $argv[0]);
    echo "-------------------- ".$argv[0]." --------------------\n";
    if ($argument_counter<$requried_arguments) {
        $arguments=str_replace(" ", "' '", $arguments);
        $arguments="'".$arguments."'";
        return myvesta_throw_error(MYVESTA_ERROR_MISSING_ARGUMENTS, "Usage: $command $arguments");
    }
    $argument_arr=explode(" ", $arguments);
    $i=1;
    foreach ($argument_arr as $argument) {
        $GLOBALS[$argument]=myvesta_fix_backslashes($argv[$i]);
        $i++;
    }
}

function myvesta_exit($code) {
    global $argv;
    echo "==================== ".$argv[0].": ".$code." ====================\n";
    exit($code);
}
