import { Injectable, Signal, signal } from '@angular/core';

export interface NotificationMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notification = signal<NotificationMessage | null>(null);

  get notification(): Signal<NotificationMessage | null> {
    return this._notification.asReadonly();
  }

  showSuccess(text: string): void {
    this._notification.set({ type: 'success', text });
  }

  showError(text: string): void {
    this._notification.set({ type: 'error', text });
  }

  showInfo(text: string): void {
    this._notification.set({ type: 'info', text });
  }

  clear(): void {
    this._notification.set(null);
  }

}