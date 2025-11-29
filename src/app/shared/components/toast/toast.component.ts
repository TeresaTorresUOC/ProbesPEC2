import { Component, effect, inject, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnDestroy {

  private notificationService = inject(NotificationService);

  // signal: notificació actual
  notification = this.notificationService.notification;

  private hideTimeout: any = null;

  constructor() {

    // quan canvia la notificació, programem auto-tancar
    effect(() => {
      const msg = this.notification();

      // Si hi ha missatge, donem-li 3 segons
      if (msg) {
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
        }
        this.hideTimeout = setTimeout(() => {
          this.notificationService.clear();
        }, 3000);
      }
    });
  }

  close() {
    this.notificationService.clear();
  }

  ngOnDestroy(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
