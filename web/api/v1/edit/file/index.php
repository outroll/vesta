<?php

include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");
$user = $_SESSION['user'];

// Check login_as feature
if (($_SESSION['user'] == 'admin') && (!empty($_SESSION['look']))) {
    $user=$_SESSION['look'];
}

if (!empty($_REQUEST['path'])) {
    $content = '';
    $path = $_REQUEST['path'];
    if (!empty($_POST['save'])) {
        $fn = tempnam ('/tmp', 'vst-save-file-');
        if ($fn) {
            $contents = $_POST['contents'];
            $contents = preg_replace("/\r/", "", $contents);
            $f = fopen ($fn, 'w+');
            fwrite($f, $contents);
            fclose($f);
            chmod($fn, 0644);

            if ($f) {
                exec (VESTA_CMD . "v-copy-fs-file {$user} {$fn} ".escapeshellarg($path), $output, $return_var);
                $error = check_return_code($return_var, $output);
                if ($return_var != 0) {
                    $error = 'Error while saving file';
                    exit;
                }
            }
            unlink($fn);
        }
    }

    exec (VESTA_CMD . "v-open-fs-file {$user} ".escapeshellarg($path), $content, $return_var);
    if ($return_var != 0) {
        $error = 'Error while opening file'; // todo: handle this more styled
        exit;
    }
    $content = implode("\n", $content)."\n";
} else {
    $content = '';
}

$result = array(
	'error' => $error,
	'content' => $content
);

echo json_encode($result);
