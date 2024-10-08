<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/check', function() { return Auth::check() ? 1 : 0; });

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
