<?php
$GLOBALS['config']['site_name'] = 'PLAN';
$GLOBALS['config']['site_domain'] = $_SERVER['HTTP_HOST'];
$GLOBALS['config']['site_url'] = 'http://'.$GLOBALS['config']['site_domain'].'/plan/';

$GLOBALS['config']['default_controller'] = 'guest';
$GLOBALS['config']['favicon'] = 'static/image/qqq.small.jpg';
$GLOBALS['config']['default_avatar'] = 'static/image/user.avatar.png';
$GLOBALS['config']['api_server'] = $GLOBALS['config']['site_url'] . 'index.php';
$GLOBALS['config']['api_check_new_verison'] = false;
$GLOBALS['config']['teamtoy_url'] = $GLOBALS['config']['site_url'];
$GLOBALS['config']['at_short_name'] = true ;
$GLOBALS['config']['can_modify_password'] = true ;
$GLOBALS['config']['timezone'] = 'Asia/Chongqing' ;
$GLOBALS['config']['dev_version'] = false ;
$GLOBALS['config']['default_language'] = 'zh_cn' ;

// session time
// you need change session lifetime in php.ini to0
$GLOBALS['config']['session_time'] = 60*60*24*3 ;

$GLOBALS['config']['plugin_path'] = AROOT . DS . 'plugin' . DS ;
$GLOBALS['config']['plugins'] = array( 'css_modifier' , 'simple_token');


