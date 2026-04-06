import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/summary/summary').then(m => m.Summary)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/category-list').then(m => m.CategoryList)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/services/service-list').then(m => m.ServiceList)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list').then(m => m.UserList)
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