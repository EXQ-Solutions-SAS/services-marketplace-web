import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="relative overflow-hidden bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm group hover:border-white/20 transition-all duration-500">
      <div [class]="'absolute -top-12 -right-12 w-32 h-32 blur-[60px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity ' + glowClass"></div>

      <div class="relative z-10 flex flex-col gap-4">
        <div class="flex justify-between items-start">
          <div [class]="'p-3 rounded-2xl bg-white/5 border border-white/10 ' + iconColor">
            <lucide-icon [img]="icon" class="w-6 h-6"></lucide-icon>
          </div>
          
          <div [class]="'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-tighter ' + (trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')">
             <span>{{ trend >= 0 ? '↑' : '↓' }}</span>
             <span>{{ trend | number:'1.1-1' }} %</span>
          </div>
        </div>

        <div>
          <p class="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{{ label }}</p>
          <h3 class="text-3xl font-black text-white tracking-tighter italic">
            {{ isCurrency ? (value | currency:'USD':'symbol':'1.0-0') : (value | number) }}
            <span *ngIf="isPercent" class="text-lg text-slate-500 -ml-2">%</span>
          </h3>
        </div>
      </div>
    </div>
  `
})
export class StatCard {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() trend: number = 0;
  @Input() icon: any;
  @Input() glowClass: string = 'bg-primary-orange';
  @Input() iconColor: string = 'text-primary-orange';
  @Input() isCurrency: boolean = false;
  @Input() isPercent: boolean = false;
}