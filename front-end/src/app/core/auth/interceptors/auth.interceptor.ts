import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { TokenService } from "../services/token.service";
import { Observable } from "rxjs";

export const TokenInterceptor:  HttpInterceptorFn = (req,next) =>{
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();
    if(token){
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    return next(req);
}