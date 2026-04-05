import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/summary/summary').then(m => m.Summary)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];