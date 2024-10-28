import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { TokenService } from "../services/token.service";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";

export const TokenInterceptor:  HttpInterceptorFn = (req,next) =>{
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();

    const primaryUrl = environment.apiUrl;
    const fallbackUrl = environment.fallbackApiUrl;

    let modifiedReq = req.clone({
        url: req.url.replace(environment.apiUrl, primaryUrl),
      });
  
    if(token){
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    
    return next(modifiedReq).pipe(
        catchError((error) => {
          // Verificar se o erro é de conexão (status 0)
          if (error.status === 0) {
            const fallbackReq = req.clone({
              url: req.url.replace(environment.apiUrl, fallbackUrl),
            });
            return next(fallbackReq);
          }
          return throwError(() => error);
        })
      );
}