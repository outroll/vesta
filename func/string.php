<?php

function myvesta_replace_in_file($file, $find, $replace) {
    if (!file_exists($file)) return myvesta_throw_error (3, "File '$file' not found");

    $buf=file_get_contents($file);

    if (strpos($buf, $find)===false) return myvesta_throw_error (4, "String '$find' not found");

    $buf=str_replace($find, $replace, $buf);
    $r=file_put_contents($file, $buf);
    return $r;
}
