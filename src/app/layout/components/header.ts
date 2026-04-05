import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-16 border-b border-white/5 bg-[#0a0e17]/50 backdrop-blur-md px-8 flex items-center justify-between">
      <div class="text-slate-400 font-medium">Panel de Control</div>
      
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm font-bold text-white">{{ auth.currentUserProfile()?.name }}</p>
          <p class="text-xs text-slate-500 capitalize">{{ auth.currentUserProfile()?.role }}</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-primary-orange/20 border border-primary-orange/40 flex items-center justify-center text-primary-orange font-bold">
          {{ auth.currentUserProfile()?.name?.charAt(0) }}
        </div>
      </div>
    </header>
  `
})
export class Header {
  auth = inject(AuthService); // Usamos el profile que cargamos al loguear
}