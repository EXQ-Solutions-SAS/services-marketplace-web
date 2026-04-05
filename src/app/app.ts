import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiService } from './core/services/ui';
import { Toast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  template: `
    <app-toast /> 
    <router-outlet />
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('services-marketplace-web');
  public ui = inject(UiService);
}
