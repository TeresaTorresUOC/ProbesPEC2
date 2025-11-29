import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly _notification = new BehaviorSubject<NotificationMessage | null>(
        null
      );

      get notification$(): Observable<NotificationMessage | null> {
        return this._notification.asObservable();
  }

  showSuccess(text: string): void {
    this._notification.next({ type: 'success', text });
  }

  showError(text: string): void {
    this._notification.next({ type: 'error', text });
  }

  showInfo(text: string): void {
    this._notification.next({ type: 'info', text });
  }

  clear(): void {
    this._notification.next(null);
  }

}