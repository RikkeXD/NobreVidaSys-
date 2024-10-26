import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalMessageService {
  private messageSubject = new Subject<any>();

  message$ = this.messageSubject.asObservable();

  constructor(private messageService: MessageService) {
    this.message$.subscribe((message) => {
      this.messageService.add(message);
    });
  }

  sendMessage(message: { severity: string; summary: string; detail: string }) {
    this.messageSubject.next(message);
  }
}
