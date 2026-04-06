import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LucideAngularModule, LayoutDashboard, Users, LogOut, LucideIconData, Toolbox, UserKey, FileText, List } from 'lucide-angular';

interface MenuItem {
  title: string;
  icon: LucideIconData;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="w-64 h-screen bg-[#0a0e17] border-r border-white/5 flex flex-col">
      <div class="p-6">
        <h1 class="text-primary-orange font-bold text-xl tracking-tight italic">
          EXQ <span class="text-white">ADMIN</span>
        </h1>
      </div>

      <nav class="flex-1 px-4 space-y-1 mt-4">
        @for (item of menuItems; track item.route) {
          <a [routerLink]="item.route" 
             routerLinkActive="bg-primary-orange/10 text-primary-orange border-l-2 border-primary-orange"
             class="flex items-center gap-3 px-4 py-3 rounded-r-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all group">
            <lucide-icon [name]="item.icon" class="w-5 h-5 text-primary-orange"></lucide-icon>
            <span class="font-medium text-sm">{{ item.title }}</span>
          </a>
        }
      </nav>

      <div class="p-4 border-t border-white/5">
        <button (click)="auth.logout()" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400 transition-all">
          <lucide-icon [img]="LogoutIcon" class="w-5 h-5"></lucide-icon> <span class="text-sm font-bold uppercase tracking-wider">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class Sidenav {
  auth = inject(AuthService);

  readonly DashboardIcon = LayoutDashboard;
  readonly UsersIcon = Users;
  readonly LogoutIcon = LogOut;
  readonly ServicesIcon = Toolbox;
  readonly ReportsIcon = FileText;
  readonly CategoriesIcon = List; // Icono personalizado para categorías

  // Solo añades una línea aquí y el menú crece solo
  menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: this.DashboardIcon, route: '/admin/dashboard' },
    { title: 'Categorias', icon: this.CategoriesIcon, route: '/admin/categories' },
    { title: 'Servicios', icon: this.ServicesIcon, route: '/admin/services' },
    { title: 'Reservas', icon: this.ServicesIcon, route: '/admin/bookings' },
    { title: 'Reseñas', icon: this.ServicesIcon, route: '/admin/reviews' },
    { title: 'Usuarios', icon: this.UsersIcon, route: '/admin/users' },
    { title: 'Reportes', icon: this.ReportsIcon, route: '/admin/reports' },
  ];
}