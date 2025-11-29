import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  NotificationMessage,
  NotificationService,
} from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  import { Component, OnDestroy } from '@angular/core';
  import { Subscription } from 'rxjs';
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnDestroy {
    notification: NotificationMessage | null = null;
    show = false;

  private hideTimeout: ReturnType<typeof setTimeout> | null = null; 
  private readonly subscription = new Subscription();


  constructor(private notificationService: NotificationService) {
    this.subscription.add(
        this.notificationService.notification$.subscribe((message) => {
          this.notification = message;

          if (message) {
            this.show = true;
            this.startAutoHide();
          } else {
            this.show = false;
            this.clearTimeout();
          }
        })
      );
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
    this.subscription.unsubscribe();
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