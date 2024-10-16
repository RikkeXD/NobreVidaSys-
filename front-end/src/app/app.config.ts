import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './core/auth/interceptors/auth.interceptor';
import { SNACK_BAR_CONFIG } from './shared/SnackBarConfig/snackBarConfig';
import { ErrorTokenInterceptor } from './core/auth/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([TokenInterceptor,ErrorTokenInterceptor])),
    SNACK_BAR_CONFIG, provideAnimationsAsync()
  ]
};
