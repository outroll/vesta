<?php
error_reporting(NULL);
$TAB = 'DB';

header('Content-Type: application/json');

// Main include
include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Data
exec (VESTA_CMD."v-list-databases $user json", $output, $return_var);
$data = json_decode(implode('', $output), true);
$data = array_reverse($data, true);
unset($output);

top_panel(empty($_SESSION['look']) ? $_SESSION['user'] : $_SESSION['look'], $TAB);

// Render page
// render_page($user, $TAB, 'list_db');

// Back uri
$_SESSION['back'] = $_SERVER['REQUEST_URI'];

list($http_host, $port) = explode(':', $_SERVER["HTTP_HOST"].":");
foreach ($data as $key => $value) {
  ++$i;

  if ( $i == 1) {
    $total_amount = __('1 database');
  } else {
    $total_amount = __('%s databases',$i);
  }

  if ($data[$key]['SUSPENDED'] == 'yes') {
    $data[$key]['status'] = 'suspended';
    $data[$key]['suspend_action'] = 'unsuspend' ;
    $data[$key]['suspend_conf'] = __('UNSUSPEND_DATABASE_CONFIRMATION', $key);
  } else {
    $data[$key]['status'] = 'active';
    $data[$key]['suspend_action'] = 'suspend';
    $data[$key]['suspend_conf'] = __('SUSPEND_DATABASE_CONFIRMATION', $key);
  }

  if ($data[$key]['TYPE'] == 'mysql'){
    $mysql = 1;

    $db_myadmin_link = "http://".$http_host."/phpmyadmin/";
    if (!empty($_SESSION['DB_PMA_URL']))
      $db_myadmin_link = $_SESSION['DB_PMA_URL'];
  }
  if ($data[$key]['TYPE'] == 'pgsql'){
    $pgsql = 1;
    $db_pgadmin_link = "http://".$http_host."/phppgadmin/";
    if (!empty($_SESSION['DB_PGA_URL']))
      $db_pgadmin_link = $_SESSION['DB_PGA_URL'];
  }

  if ($data[$key]['HOST'] != 'localhost' ) $http_host = $data[$key]['HOST'];
  if ($data[$key]['TYPE'] == 'mysql') $db_admin = "phpMyAdmin";
  if ($data[$key]['TYPE'] == 'mysql') $db_admin_link = "http://".$http_host."/phpmyadmin/";
  if (($data[$key]['TYPE'] == 'mysql') && (!empty($_SESSION['DB_PMA_URL']))) $db_admin_link = $_SESSION['DB_PMA_URL'];
  if ($data[$key]['TYPE'] == 'pgsql') $db_admin = "phpPgAdmin";
  if ($data[$key]['TYPE'] == 'pgsql') $db_admin_link = "http://".$http_host."/phppgadmin/";
  if (($data[$key]['TYPE'] == 'pgsql') && (!empty($_SESSION['DB_PGA_URL']))) $db_admin_link = $_SESSION['DB_PGA_URL'];

  $data[$key]['delete_conf'] = __('DELETE_DATABASE_CONFIRMATION', $key);
}

$object = (object)[];
$object->data = $data;
$object->user = $user;
$object->panel = $panel;
$object->db_admin = $db_admin;
$object->db_admin_link = $db_admin_link;
$object->totalAmount = $total_amount;
$object->databases = $databases;
$object->dbFav = $_SESSION['favourites']['DB'];

print json_encode($object);