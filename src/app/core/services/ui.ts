import { Injectable, signal } from '@angular/core';

export type NotificationType = 'SUCCESS' | 'ERROR' | 'WARNING';

@Injectable({ providedIn: 'root' })
export class UiService {
  // Signals para controlar la visibilidad y el contenido
  show = signal(false);
  message = signal('');
  type = signal<NotificationType>('SUCCESS');

  showNotification(msg: string, type: NotificationType = 'SUCCESS') {
    this.message.set(msg);
    this.type.set(type);
    this.show.set(true);

    // Auto-hide después de 4 segundos
    setTimeout(() => {
      this.show.set(false);
    }, 4000);
  }
}