import { Component, computed, ContentChild, Input, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search } from 'lucide-angular';

export interface TableColumn {
    label: string;
    key: string;
}

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-black text-white tracking-tight uppercase">{{ title }}</h2>
          <p class="text-slate-500 text-xs font-bold tracking-widest">{{ subtitle }}</p>
        </div>

        <div class="relative w-64 group">
          <lucide-icon [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-orange transition-colors"></lucide-icon>
          <input type="text" 
       (input)="onSearch($event)" 
       placeholder="Filtrar registros..." 
       class="w-full bg-[#0a0e17] border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-orange/50 transition-all">
        </div>
      </div>

      <div class="bg-[#0a0e17] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                @for (col of columns; track col.key) {
                  <th class="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                    {{ col.label }}
                  </th>
                }
                <th class="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-white/5">
              @for (item of filteredData(); track item.id) {
                <tr class="hover:bg-white/[0.01] transition-all group">
                  @for (col of columns; track col.key) {
                    <td class="p-6">
                      <ng-container 
                        *ngTemplateOutlet="cellTemplate || defaultCell; context: { $implicit: item, key: col.key }">
                      </ng-container>
                    </td>
                  }
                  
                  <td class="p-6 text-right">
                    <ng-container 
                      *ngTemplateOutlet="actionsTemplate || defaultActions; context: { $implicit: item }">
                    </ng-container>
                  </td>
                </tr>
              } @empty {
                <tr>
                    <td [attr.colspan]="columns? columns.length + 1: 1" class="p-20 text-center text-slate-500">
                        @if (searchTerm()) {
                            No se encontraron resultados para "{{ searchTerm() }}"
                        } @else {
                            <div class="flex flex-col items-center gap-3">
                                <div class="w-6 h-6 border-2 border-primary-orange border-t-transparent rounded-full animate-spin"></div>
                                <span class="text-[10px] font-black uppercase tracking-[0.2em]">Sincronizando datos...</span>
                            </div>
                        }
                    </td>
                </tr>
                }
            </tbody>
          </table>
        </div>

        <div class="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span class="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Mostrando {{ filteredData().length }} resultados</span>
            <div class="flex gap-2">
                <button class="p-2 px-4 rounded-xl border border-white/5 text-slate-500 hover:text-white transition-all text-xs font-bold">Prev</button>
                <button class="p-2 px-4 rounded-xl bg-white/5 text-white hover:bg-primary-orange transition-all text-xs font-bold">Next</button>
            </div>
        </div>
      </div>
    </div>

    <ng-template #defaultCell let-item let-key="key">
      <span class="text-sm text-slate-300">{{ item[key] }}</span>
    </ng-template>

    <ng-template #defaultActions>
      <button class="text-slate-600 hover:text-white transition-colors">...</button>
    </ng-template>
  `
})
export class DataTableComponent {
    readonly SearchIcon = Search;

    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() columns: TableColumn[] = [];

    _internalData = signal<any[]>([]);

    @Input() set data(value: any[]) {
        this._internalData.set(value || []);
    }

    // Recibimos los templates personalizados del padre
    @Input() cellTemplate?: TemplateRef<any>;
    @Input() actionsTemplate?: TemplateRef<any>;

    searchTerm = signal('');

    filteredData = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        const currentData = this._internalData(); // Accedemos al signal interno

        if (!term) return currentData;

        return currentData.filter(item =>
            JSON.stringify(item).toLowerCase().includes(term)
        );
    });

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchTerm.set(value);
    }
}