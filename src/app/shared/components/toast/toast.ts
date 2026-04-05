import { Component, inject } from '@angular/core';
import { UiService } from '../../../core/services/ui';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ui.show()) {
      <div class="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
        <div [class]="containerClasses" 
             class="flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md shadow-lg transition-all">
          
          <span class="text-lg">{{ icon }}</span>
          <p class="text-sm font-medium text-slate-200">{{ ui.message() }}</p>
          
          <button (click)="ui.show.set(false)" class="ml-2 text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class Toast {
  ui = inject(UiService);

  get containerClasses() {
    const types = {
      'SUCCESS': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      'ERROR': 'bg-rose-500/10 border-rose-500/20 text-rose-400', // Un rojo "rosa" más suave
      'WARNING': 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    };
    return types[this.ui.type()];
  }

  get icon() {
    const icons = { 'SUCCESS': '✨', 'ERROR': '✕', 'WARNING': '⚠' };
    return icons[this.ui.type()];
  }
}