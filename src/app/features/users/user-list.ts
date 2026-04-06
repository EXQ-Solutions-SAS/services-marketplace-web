import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, } from 'lucide-angular';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { UserService } from '../../core/services/user';
import { lastValueFrom } from 'rxjs';
import { User } from '../../core/models/entities';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [DataTableComponent, LucideAngularModule, CommonModule],
    template: `
    <app-data-table
      title="Usuarios"
      subtitle="Gestión de cuentas y accesos"
      [columns]="userColumns"
      [data]="users()"
      [cellTemplate]="userCell"
      [actionsTemplate]="userActions">
    </app-data-table>

    <ng-template #userCell let-user let-key="key">
      @switch (key) {
        @case ('user') {
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary-orange/10 flex items-center justify-center text-primary-orange font-black text-xs">
              {{ user.name.slice(0,2) }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-white">{{ user.name }}</span>
              <span class="text-[11px] text-slate-500 font-mono">{{ user.email }}</span>
            </div>
          </div>
        }
        @default {
          <span class="text-sm text-slate-400 font-mono">{{ user[key] }}</span>
        }
      }
    </ng-template>

    <ng-template #userActions let-user>

    </ng-template>
  `
})
export class UserList {

    userColumns = [
        { label: 'Usuario', key: 'user' },
        { label: 'Rol', key: 'role' },
        { label: 'ID', key: 'id' }
    ];
    private userService = inject(UserService);
    users = signal<User[]>([]);
    isLoading = signal(false);

    ngOnInit() {
        this.loadUsers();
    }

    async loadUsers() {
        this.isLoading.set(true);
        try {
            const data: User[] = await lastValueFrom(this.userService.getAll());
            this.users.set(data);
        } catch (error) {
            console.error('Error loading users', error);
        } finally {
            this.isLoading.set(false);
        }
    }

}