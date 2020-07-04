<?php
error_reporting(NULL);
$TAB = 'USER';

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Data
if ($user == 'admin') {
    exec (VESTA_CMD . "v-list-users json", $output, $return_var);
} else {
    exec (VESTA_CMD . "v-list-user ".$user." json", $output, $return_var);
}
$data = json_decode(implode('', $output), true);
$data = array_reverse($data,true);

// Check and get changelog if needed
if ($user == 'admin') {
    if (file_exists("/usr/local/vesta/data/upgrades/show_changelog")) {
        $show_changelog_value=file_get_contents("/usr/local/vesta/data/upgrades/show_changelog");
        $show_changelog_value_int=intval($show_changelog_value);
        if ($show_changelog_value_int==1) {
            $changelog='';
            $changelog_arr=file("/usr/local/vesta/Changelog.md");
            for ($i=0; $i<30; $i++) {
                if (trim($changelog_arr[$i])=="") break;
                if ($i>1) $changelog.="\n";
                $changelog.=$changelog_arr[$i];
            }
            file_put_contents("/usr/local/vesta/data/upgrades/show_changelog", "0");
        }
    }
}

// Render page
render_page($user, $TAB, 'list_user');

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];
