import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category';
import { Category } from '../../core/models/entities';
import { CategoryForm } from './category-form'; // El modal que hicimos
import { Droplets, FolderOpen, Layers, LucideAngularModule, Pencil, Plus, Trash2, Zap, Paintbrush, Hammer, Car, Home, Camera, Scissors, X, Check } from 'lucide-angular';
import { UiService } from '../../core/services/ui';
import { lastValueFrom } from 'rxjs';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, CategoryForm, ConfirmModal],
    template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-white tracking-tight">CATEGORÍAS</h2>
          <p class="text-slate-500 text-sm font-medium uppercase tracking-widest">
            Exq Solutions / Marketplace
          </p>
        </div>
        <button (click)="openModal()" 
                class="bg-primary-orange hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 active:scale-95">
          <lucide-icon [img]="PlusIcon" class="w-5 h-5"></lucide-icon>
          Añadir Categoría
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        @for (cat of categories(); track cat.id) {
          <div class="bg-[#0a0e17] border border-white/5 p-6 rounded-3xl hover:border-primary-orange/40 transition-all group relative overflow-hidden">
            
            <lucide-icon [img]="getIcon(cat.icon)" 
                         class="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.02] group-hover:text-primary-orange/[0.05] transition-colors">
            </lucide-icon>

            <div class="flex justify-between items-start relative z-10">
              <div class="p-3 bg-primary-orange/10 rounded-2xl text-primary-orange border border-primary-orange/20">
                <lucide-icon [img]="getIcon(cat.icon)" class="w-6 h-6"></lucide-icon>
              </div>
              
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button (click)="openModal(cat)" class="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                  <lucide-icon [img]="PencilIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="confirmDelete(cat.id)" class="p-2 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-400 transition-colors" title="Eliminar">
                  <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
            
            <div class="mt-5 relative z-10">
              <h3 class="text-lg font-bold text-slate-100 group-hover:text-primary-orange transition-colors">{{ cat.name }}</h3>
              <p class="text-slate-500 text-sm mt-2 line-clamp-2 h-10">{{ cat.description }}</p>
              
              <div class="mt-6 flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">Precio sugerido</span>
                  <span class="text-sm font-mono font-bold text-emerald-400">
                    {{ cat.basePrice | currency:'COP':'symbol':'1.0-0' }}
                  </span>
                </div>
                <span class="text-[9px] bg-white/5 px-2 py-1 rounded-lg text-slate-500 border border-white/5">
                  ID: {{ cat.id.split('-')[0] }}
                </span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <lucide-icon [img]="EmptyIcon" class="w-12 h-12 text-slate-700 mx-auto mb-4"></lucide-icon>
            <p class="text-slate-500">No hay categorías registradas en el Marketplace</p>
          </div>
        }
      </div>

      @if (isModalOpen()) {
        <app-category-form 
          [category]="selectedCategory()" 
          (close)="closeModal()" 
          (saved)="loadCategories()">
        </app-category-form>
      }
      @if (showConfirm()) {
        <app-confirm-modal 
            [itemType]="'esta categoría'" 
            (cancel)="showConfirm.set(false)" 
            (confirm)="onDelete()">
        </app-confirm-modal>
        }
    </div>
  `
})
export class CategoryList {

    readonly PlusIcon = Plus;
    readonly PencilIcon = Pencil;
    readonly TrashIcon = Trash2;
    readonly DefaultIcon = Layers;
    readonly EmptyIcon = FolderOpen;

    private iconMap: Record<string, any> = {
        'droplets': Droplets,
        'zap': Zap,
        'paintbrush': Paintbrush,
        'hammer': Hammer,
        'car': Car,
        'home': Home,
        'camera': Camera,
        'scissors': Scissors,
        'layers': Layers
    };

    private catService = inject(CategoryService);
    private ui = inject(UiService);

    categories = signal<Category[]>([]);
    isModalOpen = signal(false);
    selectedCategory = signal<Category | null>(null);

    showConfirm = signal(false);
    idToDelete = signal<string | null>(null);

    ngOnInit() {
        this.loadCategories();
    }

    getIcon(iconName: string | undefined | null) {
        if (!iconName) return Layers;
        // Retorna el objeto del mapa o el icono por defecto si no existe
        return this.iconMap[iconName] || Layers;
    }

    async loadCategories() {
        try {
            const data = await lastValueFrom(this.catService.getAll());
            this.categories.set(data);
        } catch (err) {
            this.ui.showNotification('Error al cargar categorías', 'ERROR');
        }
    }

    openModal(cat: Category | null = null) {
        this.selectedCategory.set(cat);
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
        this.selectedCategory.set(null);
    }

    confirmDelete(id: string) {
        this.idToDelete.set(id);
        this.showConfirm.set(true);
    }

    async onDelete() {
        const id = this.idToDelete();
        if (!id) return;

        try {
            await lastValueFrom(this.catService.delete(id));
            this.ui.showNotification('Categoría eliminada con éxito', 'SUCCESS');
            this.showConfirm.set(false);
            this.loadCategories();
        } catch (err) {
            this.ui.showNotification('No se pudo eliminar la categoría', 'ERROR');
            this.showConfirm.set(false);
        }
    }
}