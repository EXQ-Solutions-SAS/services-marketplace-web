import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de que tenga el standalone
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    try {
      // Esperamos el proceso completo (Firebase + Check Role en NestJS)
      await this.authService.login(email, password);
      console.log('Login exitoso, perfil:', this.authService.currentUserProfile());
      // Si llega aquí, es ADMIN y el AuthService ya redirigió o podemos hacerlo aquí
      this.router.navigate(['/admin/dashboard']);

    } catch (err: any) {
      this.isLoading.set(false);

      let msg = '';
      if (err.message.includes('Acceso denegado')) {
        msg = '⚠️ No tienes permisos de administrador.';
      } else if (err.code === 'auth/invalid-credential') {
        msg = '❌ Correo o contraseña incorrectos.';
      } else if (err.name === 'HttpErrorResponse') {
        msg = '🚀 Error de comunicación con el servidor (CORS o Down).';
      } else {
        msg = 'Ocurrió un error inesperado.';
      }

      this.errorMessage.set(msg);
    }
  }
}