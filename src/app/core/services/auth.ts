import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, lastValueFrom, Observable } from 'rxjs';
import { ApiService } from './api';
import { Role } from '../models/enums';
import { User } from '../models/entities';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private api = inject(ApiService);

  // Signal para saber si hay un usuario en tiempo real
  currentUserProfile = signal<User | null>(null);

  constructor() {
    user(this.auth).subscribe(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await lastValueFrom(this.api.get<User>('users/me'));
          this.currentUserProfile.set(profile);
        } catch {
          this.currentUserProfile.set(null);
        }
      } else {
        this.currentUserProfile.set(null);
      }
    });
  }

  async login(email: string, pass: string) {
    await signInWithEmailAndPassword(this.auth, email, pass);

    try {
      const profile = await lastValueFrom(this.api.get<User>('users/me'));

      if (profile.role === Role.ADMIN) { // 👈 Usamos el Enum
        this.currentUserProfile.set(profile);
        this.router.navigate(['/admin/dashboard']);
      } else {
        await this.logout();
        throw new Error('Acceso denegado: Se requiere rol de Administrador');
      }
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.currentUserProfile.set(null);
    this.router.navigate(['/login']);
  }
}
