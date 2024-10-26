import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalMessageService } from '../services/global-message.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token')
  const messageService = inject(GlobalMessageService);
  
  if (!token) {
    router.navigate(["/"])
    messageService.sendMessage({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Você precisa estar logado para acessar essa página',
    });
    return false;
  }
  return true;
};
