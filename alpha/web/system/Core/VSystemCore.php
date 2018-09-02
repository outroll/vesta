<?php
defined('VestaCP') or die('No Script Kiddles');
include_once(SystemPath.'Helpers/Initiation_Helpers.php');
if(!class_exists('V_SystemCore')){
	/**
	* V_SystemCore
	* The Core Package for the VestaCP New Engine
	* 
	* @package    VestaCP
	* @subpackage Core
	* @author     SkullWritter <geral@skullwritter.com>
	* @since	  0.0.1
	*/
	Class V_SystemCore{
			/**
			* $instance
			* The Instance Container
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			private static $instance=null;
			/**
			* &get_instance
			* The function that returns the instance correwctly
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			public static function &get_instance(){
				if(self::$instance === null){
					self::$instance = new static;
				}
				return self::$instance;
			}
			/**
			* $system
			* The function that contains system information
			* From Configs to debug values (and some main functions)
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			public $system;
			/**
			* __construct
			* The function that initiates part of the code 
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			private function __construct(){
				$this->initiate_debug();
				$this->system=(Object) array();
				$this->system->startup=microtime(true);
				
				//include_once(EPath.'Core/VSystemLoader.php');
				//$this->load=new V_SystemLoader();
				//in_once(EPath.'Core/VSystemError.php');
				//$this->load->core('ERROR','erro');
				//$this->error=$this->erro=new V_SystemError();
				//$this->load->sk_register_class('erro', 'V_SystemError');
				//$this->load->sk_register_class('error', 'V_SystemError');
				//$this->load->sk_register_class('load', 'V_SystemLoader');
			}
			/**
			* proceed_initiation
			* The function that continues the initiation when the core is loaded
			* (the instance)
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			function proceed_initiation(){
				$sys=&gi();
				//$this->debug();
				$this->system_debug();
				$sys->load->core('ERRO','erro')
					->load->core('PRELOAD','system/preload');
			}
			/**
			* $__debug
			* The app and system debug configs container
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			private static $__debug=array();
			
			/**
			* initiate_debug
			* The debug initiator
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			private function initiate_debug(){
				self::$__debug=array(
					'user'=>array(
						'default'=>false,
						'static'=>false,
						'overRide'=>false,
					),
					'system'=>array(
						'default'=>false,
						'static'=>false,
						'overRide'=>false,
					)
				);
			}
			/**
			* debug
			* The app debug initiator
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			* @param	  $overSystem true|false	tels to override the debug and turn it to true
			*/
			public function debug($overSystem=false){
				if(defined('SKWR_Debug') && (SKWR_Debug===true) && ($overSystem===false)){
					error_reporting(E_ALL);
					ini_set('display_errors', 1);
					self::$__debug['user']['default']=true;
					self::$__debug['user']['static']=true;
					self::$__debug['user']['overRide']=$overSystem;
				}elseif(self::$__debug===true){
					error_reporting(~E_ALL);
					ini_set('display_errors', 0);
					self::$__debug['user']['default']=false;
					self::$__debug['user']['static']=false;
					self::$__debug['user']['overRide']=false;
				}else{
					error_reporting(E_ALL);
					ini_set('display_errors', 1);
					self::$__debug['user']['default']=true;
					self::$__debug['user']['static']=false;
					self::$__debug['user']['overRide']=false;
				}
			}
			/**
			* debug_states
			* The app debug states
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			public function debug_states(){
				$sys_state=array(
					'DEBUG'=>self::$__debug['user']['default'],
					'DEBUG_STATIC'=>self::$__debug['user']['static'],
					'OVERRIDED'=>self::$__debug['user']['overRide'],
				);
				return $sys_state;
			}
			/**
			* debug_state
			* The app debug status
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			public function debug_state(){
				$debug_states=$this->debug_states();
				return $debug_states['DEBUG'];
			}
			/**
			* system_debug
			* The system debug initiator
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			* @param	  $overSystem true|false	tels to override the debug and turn it to true
			*/
			public function system_debug($overSystem=false){
				if(defined('SKWR_SYS_Debug') && (SKWR_SYS_Debug===true) && ($overSystem===false)){
					error_reporting(E_ALL);
					ini_set('display_errors', 1);
					self::$__debug['system']['default']=true;
					self::$__debug['system']['static']=true;
					self::$__debug['system']['overRide']=$overSystem;
				}elseif(self::$__debug===true){
					error_reporting(~E_ALL);
					ini_set('display_errors', 0);
					self::$__debug['system']['default']=false;
					self::$__debug['system']['static']=false;
					self::$__debug['system']['overRide']=false;
				}else{
					error_reporting(E_ALL);
					ini_set('display_errors', 1);
					self::$__debug['system']['default']=true;
					self::$__debug['system']['static']=false;
					self::$__debug['system']['overRide']=false;
				}
			}
			/**
			* system_debug_states
			* The system debug states
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			public function system_debug_states(){
				$sys_state=array(
					'SYSTEM_DEBUG'=>self::$__debug['system']['default'],
					'SYSTEM_DEBUG_STATIC'=>self::$__debug['system']['static'],
					'SYSTEM_OVERRIDED'=>self::$__debug['system']['overRide'],
				);
				return $sys_state;
			}
			/**
			* system_debug_state
			* The system debug status
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			public function system_debug_state(){~
			$system_debug_states=$this->system_debug_states();
				return $system_debug_states['SYSTEM_DEBUG'];
			}
			/**
			* __clone
			* prevent code clonning
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			private function __clone(){}
			/**
			* __wakeup
			* prevent wakeup calls
			* 
			* @package    VestaCP
			* @subpackage Core
			* @author     SkullWritter <geral@skullwritter.com>
			* @since	  0.0.1
			*/
			private function __wakeup(){}
		}
		/* ************************************ */
		/* 				END The Core		 	*/
		/* ************************************ */
		/* INITIARE THE PRELOADER*/
		
		$sys=&gi();
		//skwr_core::set_instance($sys);
		//$sys->proceed_initiation();
		//$sys->load->core('PRELOAD','system/preload');
}else{
	exit('NOT ALLOWED');
}
