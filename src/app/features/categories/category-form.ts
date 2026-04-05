import { Component, inject, input, output, signal, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LucideAngularModule, Droplets, Zap, Paintbrush, Hammer, Car, Home, Camera, Scissors, X, Check, Layers } from 'lucide-angular';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from '../../core/services/category';
import { Category } from '../../core/models/entities';
import { UiService } from '../../core/services/ui';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [ReactiveFormsModule, LucideAngularModule, CommonModule],
    template: `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div class="bg-[#0a0e17] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 class="text-xl font-bold text-white">{{ category() ? 'Editar' : 'Nueva' }} Categoría</h3>
          <button (click)="close.emit()" class="text-slate-500 hover:text-white"><lucide-icon [img]="XIcon"></lucide-icon></button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          
          <div class="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <label class="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-[0.2em]">Icono Representativo</label>
            
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-2xl bg-primary-orange/10 border border-primary-orange/20 flex items-center justify-center text-primary-orange shadow-lg shadow-orange-500/10">
                <lucide-icon [img]="getSelectedIcon()" class="w-8 h-8"></lucide-icon>
              </div>

              <div class="flex-1 grid grid-cols-5 gap-2">
                @for (icon of availableIcons; track icon.name) {
                  <button type="button" 
                    (click)="form.patchValue({ icon: icon.name })"
                    [class.bg-primary-orange]="form.get('icon')?.value === icon.name"
                    [class.text-white]="form.get('icon')?.value === icon.name"
                    [class.scale-110]="form.get('icon')?.value === icon.name"
                    class="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-90">
                    <lucide-icon [img]="icon.icon" class="w-5 h-5"></lucide-icon>
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="label-style">Nombre</label>
              <input type="text" formControlName="name" class="input-style" placeholder="Ej. Plomería">
            </div>
            <div class="col-span-2">
              <label class="label-style">Descripción</label>
              <textarea formControlName="description" rows="2" class="input-style"></textarea>
            </div>
            <div class="col-span-2">
              <label class="label-style">Precio Base (COP)</label>
              <input type="number" formControlName="basePrice" class="input-style">
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" (click)="close.emit()" class="btn-secondary">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || isLoading()" class="btn-primary">
              <span class="flex items-center justify-center gap-2">
                @if (isLoading()) {
                  <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                } @else {
                  <lucide-icon [img]="CheckIcon" class="w-4 h-4"></lucide-icon>
                  Confirmar Guardado
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .label-style { @apply block text-[11px] font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider; }
    .input-style { @apply w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-primary-orange focus:bg-primary-orange/5 transition-all placeholder:text-slate-700; }
    .btn-primary { @apply flex-1 px-4 py-4 rounded-2xl bg-primary-orange text-white font-black uppercase text-xs tracking-widest hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]; }
    .btn-secondary { @apply flex-1 px-4 py-4 rounded-2xl border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all; }
  `]
})
export class CategoryForm {
    readonly XIcon = X;
    readonly CheckIcon = Check;
    private catService = inject(CategoryService);
    private ui = inject(UiService);

    category = input<Category | null>(null);
    close = output<void>();
    saved = output<void>();
    isLoading = signal(false);

    availableIcons = [
        { name: 'droplets', icon: Droplets },
        { name: 'zap', icon: Zap },
        { name: 'paintbrush', icon: Paintbrush },
        { name: 'hammer', icon: Hammer },
        { name: 'car', icon: Car },
        { name: 'home', icon: Home },
        { name: 'camera', icon: Camera },
        { name: 'scissors', icon: Scissors },
        { name: 'layers', icon: Layers }
    ];

    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        basePrice: new FormControl(0, [Validators.required, Validators.min(0)]),
        icon: new FormControl('layers')
    });

    constructor() {
        effect(() => {
            const cat = this.category();
            if (cat) {
                this.form.patchValue({
                    name: cat.name,
                    description: cat.description || '',
                    basePrice: cat.basePrice,
                    icon: cat.icon || 'layers'
                });
            }
        });
    }

    // Helper para obtener el objeto del icono seleccionado para el preview
    getSelectedIcon() {
        const currentName = this.form.get('icon')?.value;
        return this.availableIcons.find(i => i.name === currentName)?.icon || Layers;
    }

    async onSubmit() {
        if (this.form.invalid) return;
        this.isLoading.set(true);
        try {
            const data = this.form.getRawValue() as Partial<Category>;
            if (this.category()) {
                await lastValueFrom(this.catService.update(this.category()!.id, data));
                this.ui.showNotification('Categoría actualizada', 'SUCCESS');
            } else {
                await lastValueFrom(this.catService.create(data));
                this.ui.showNotification('Categoría creada', 'SUCCESS');
            }
            this.saved.emit();
            this.close.emit();
        } catch (e) {
            this.ui.showNotification('Error en la operación', 'ERROR');
        } finally {
            this.isLoading.set(false);
        }
    }
}