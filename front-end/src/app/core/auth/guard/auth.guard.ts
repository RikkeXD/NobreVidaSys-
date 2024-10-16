import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token')
  const matSnackBar = inject(MatSnackBar)
  
  if (!token) {
    router.navigate(["/"])
    matSnackBar.open("Faça o login! ", "Fechar")
    return false;
  }
  return true;
};
