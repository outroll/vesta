<?php

function myvesta_replace_in_file($find, $replace, $file) {
    if (!file_exists($file)) return myvesta_throw_error (MYVESTA_ERROR_FILE_DOES_NOT_EXISTS, "File '$file' not found");

    $buf=file_get_contents($file);

    if (strpos($buf, $find)===false) return myvesta_throw_error (MYVESTA_ERROR_STRING_NOT_FOUND, "String '$find' not found");

    $buf=str_replace($find, $replace, $buf);
    $r=file_put_contents($file, $buf);
    return $r;
}
