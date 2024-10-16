import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { TokenService } from "../services/token.service";

export const ErrorTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService)
    const router = inject(Router)
    return next(req).pipe(
        catchError((error) => {
            if ([401].includes(error.status)) {
                tokenService.removeToken()
                router.navigateByUrl('/')
                window.location.reload()
            }
            return throwError(() => error)
        })
    )
}
