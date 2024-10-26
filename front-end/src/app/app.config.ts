import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './core/auth/interceptors/auth.interceptor';

import { ErrorTokenInterceptor } from './core/auth/interceptors/error.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([TokenInterceptor,ErrorTokenInterceptor])),
    provideAnimationsAsync(),
    MessageService
  ]
};
