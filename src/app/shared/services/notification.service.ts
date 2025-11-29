import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  notification = signal<NotificationMessage | null>(null);

  showSuccess(text: string) {
    this.notification.set({ type: 'success', text });
  }

  showError(text: string) {
    this.notification.set({ type: 'error', text });
  }

  showInfo(text: string) {
    this.notification.set({ type: 'info', text });
  }

  clear() {
    this.notification.set(null);
  }
}
