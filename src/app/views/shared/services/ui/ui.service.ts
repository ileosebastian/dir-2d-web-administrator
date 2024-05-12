import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { NotificationToast } from '../../models/notification-toast.interface';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private toast: ToastController
  ) { }

  async showNotification(message: NotificationToast) {
    (await this.toast.create(message)).present();
  }
}
