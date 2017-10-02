<?php

if(!defined('VESTA_CMD')) {
    die('No direct access allowed');
}

class Hook {
    $filters = [];
    
    public function add_filter($callback, $priority = 1) {
        $filters[] = [
            'function' => $callback, 
            'priority' => $priority
        ];
        
        usort($filters, function ($a, $b) {
            return $a["priority"] - $b["priority"];
        });
    }
    
    public function do_action($args) {
        foreach($filters as $filterCallback) {
            if(is_array($args)) {
                call_user_func_array($filterCallback['function'], $args);
            }
            else {
                call_user_func_array($filterCallback['function'], array());
            }
        }
    }
}