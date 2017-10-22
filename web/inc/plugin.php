<?php

if(!defined('VESTA_CMD')) {
    die('No direct access allowed');
}

$hooks = [];
$topMenuItems = [];
function add_action($tag, $callback) {
    if(!isset($hooks[$tag])) {
        $hooks[$tag] = new Hook();
    }
    $hooks[$tag]->add_filter($tag, $callback);
}

function do_action($tag, $args = []) {
    if(isset($hooks[$tag])) {
        $hooks[$tag]->do_action($args);
    }
}

function add_top_menu_item($text, $link, $admin = false, $parentPage = null, $priority = 0, $callback = null) {
    global $topMenuItems;
    if($parentPage == null) {
        $topMenuItems[$text] = [
            'text' => $text,
            'page' => $link,
            'admin' => $admin,
            'priority' => $priority,
            'callback' => $callback,
        ];
        usort($topMenuItems, function ($a, $b) {
            return $a["priority"] - $b["priority"];
        });
    }
    else {
        $element = null;
        foreach($topMenuItems as $key => $item) {
            if($item['text'] == $parentPage) {
                $element = $key;
                continue;
            }
        }
        
        if($element == null) {
            $element = $parentPage;
            $topMenuItems[$parentPage] = [
                'text' => $parentPage,
                'page' => '',
                'admin' => true,
                'priority' => 99,
                'callback' => null,
            ];
        }
        
        if(isset($topMenuItems[$element])) {
            if(!isset($topMenuItems[$element]['child'])) {
                $topMenuItems[$element]['child'] = [];
            }
            $topMenuItems[$element]['child'][$text] = [
                'text' => $text,
                'page' => $link,
                'admin' => $admin,
                'priority' => $priority,
                'callback' => $callback,
            ];
            usort($topMenuItems[$element]['child'], function ($a, $b) {
                return $a["priority"] - $b["priority"];
            });
        }
        
        usort($topMenuItems, function ($a, $b) {
            return $a["priority"] - $b["priority"];
        });
    }
}

function generate_top_menu() {
    global $topMenuItems;
    $result = "";
    foreach($topMenuItems as $menu) {
        if(!$menu['admin'] || ($menu['admin'] && $_SESSION['user'] == 'admin')) {
            $sub = "";
            if(isset($menu['child'])) {
                $sub .= "<ul class=\"dropdown-menu\">";
                foreach($menu['child'] as $child) {
                    if(!$child['admin'] || ($child['admin'] && $_SESSION['user'] == 'admin')) {
                        $sub .= "<li><a href=\"" . $child['page'] . "\">" . $child['text'] . "</a></li>";
                    }
                }
                $sub .= "</ul>";
            }
            if(!isset($TAB)) {
                $TAB = "";
            }
            $result .= '<div class="l-menu__item ' . ($TAB == strtoupper($menu['text']) ? 'l-menu__item--active' : '') . (strlen($sub) > 0 ? 'l-menu-dropdown' : '') . '"><a href="' . $menu['page'] . '">' . __($menu['text'])  . '</a>' . $sub . '</div>';
        }
    }
    return $result;
}

//Initialize top menu
add_top_menu_item('Packages', '/list/package', true, null, 1);
add_top_menu_item('IP', '/list/ip', true, null, 2);
add_top_menu_item('Graphs', '/list/rrd', true, null, 3);
add_top_menu_item('Statistics', '/list/stats', false, null, 4);
add_top_menu_item('Log', '/list/log', false, null, 5);
add_top_menu_item('Updates', '/list/updates', true, null, 6);
if ((isset($_SESSION['FIREWALL_SYSTEM'])) && (!empty($_SESSION['FIREWALL_SYSTEM']))) {
    add_top_menu_item('Firewall', '/list/firewall', true, null, 7);
}
if ((isset($_SESSION['FILEMANAGER_KEY'])) && (!empty($_SESSION['FILEMANAGER_KEY']))) {
    add_top_menu_item('File Manager', '/list/directory', false, null, 8);
}
add_top_menu_item('Server', '/list/server', true, null, 9);
add_top_menu_item('Plugin', '/list/plugin', true, null, 10);

//Load plugins
exec (VESTA_CMD."v-list-plugins json", $output, $return_var);
$plugins = json_decode(implode('', $output), true);
unset($output);

$activePlugins = [];
foreach($plugins as $plugin => $data) {
    if($data['ACTIVE'] == 'yes') {
        $activePlugins[$plugin] = $data;
        $file = '/usr/local/vesta/plugin/' . $plugin . '/web/index.php';
        if(file_exists($file)) {
            include $file;
        }
    }
}