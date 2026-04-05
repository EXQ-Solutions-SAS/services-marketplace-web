import { Component, input, output } from "@angular/core";
import { AlertTriangle, LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div class="bg-[#0a0e17] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
        <div class="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
          <lucide-icon [img]="WarnIcon" class="w-8 h-8"></lucide-icon>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">¿Estás seguro?</h3>
        <p class="text-slate-400 text-sm mb-8">Esta acción eliminará {{ itemType() }} permanentemente del Marketplace.</p>
        
        <div class="flex gap-3">
          <button (click)="cancel.emit()" 
                  class="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
            Cancelar
          </button>
          <button (click)="confirm.emit()" 
                  class="flex-1 px-4 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModal {
    readonly WarnIcon = AlertTriangle;
    
    // Inputs y Outputs modernos
    itemType = input<string>('este elemento'); 
    cancel = output<void>();
    confirm = output<void>();
}