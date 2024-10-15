<?php

namespace App\Providers;

use App\Http\Middleware\RedirectIfAuthenticatedExceptForAPI;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
      $this->app->singleton(RedirectIfAuthenticatedExceptForAPI::class);    
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
