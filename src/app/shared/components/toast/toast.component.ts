import { Component, OnDestroy, effect, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  NotificationMessage,
  NotificationService,
} from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnDestroy {
  notification = this.notificationService.notification;
  show = signal(false);

  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private notificationService: NotificationService) {
    effect(() => {
      const message = this.notification();

      if (message) {
        this.show.set(true);
        this.startAutoHide();
      } else {
        this.show.set(false);
        this.clearTimeout();
      }
    });
  }

  iconFor(type: NotificationMessage['type']): string {
    const icons: Record<NotificationMessage['type'], string> = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
    };

    return icons[type];
  }

  close(): void {
    this.clearTimeout();
    this.notificationService.clear();
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  private startAutoHide(): void {
    this.clearTimeout();
    this.hideTimeout = setTimeout(() => this.close(), 3500);
  }

  private clearTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}