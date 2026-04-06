import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, X, Mail, Phone, Calendar, Shield, Hash, User as UserIcon } from 'lucide-angular';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { UserService } from '../../core/services/user';
import { lastValueFrom } from 'rxjs';
import { User } from '../../core/models/entities';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [DataTableComponent, LucideAngularModule, CommonModule],
    templateUrl: './user-list.html' // Usaremos el HTML de abajo
})
export class UserList implements OnInit {
    // Iconos para el template y el drawer
    readonly EyeIcon = Eye;
    readonly XIcon = X;
    readonly MailIcon = Mail;
    readonly PhoneIcon = Phone;
    readonly CalendarIcon = Calendar;
    readonly RoleIcon = Shield;
    readonly IDIcon = Hash;

    userColumns = [
        { label: 'Usuario', key: 'user' },
        { label: 'Rol', key: 'role' },
        { label: 'ID', key: 'id' }
    ];

    private userService = inject(UserService);
    users = signal<User[]>([]);
    isLoading = signal(false);

    // Estado para el Detalle (Drawer)
    showDetails = signal(false);
    selectedUser = signal<User | null>(null);

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

    openDetails(user: User) {
        this.selectedUser.set(user);
        this.showDetails.set(true);
    }
}