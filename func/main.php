<?php

$myvesta_current_user=exec('whoami', $myvesta_output, $myvesta_return_var);
if ($myvesta_current_user != 'root') {echo "ERROR: You must be root to execute this script\n"; exit(1);}

define('myvesta_exit_on_error', true);

function myvesta_throw_error($code, $message) {
    echo "ERROR: ".$message."\n";
    if (defined('myvesta_exit_on_error')) myvesta_exit($code);
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
        return myvesta_throw_error(1, "Usage: $command $arguments");
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
