import { inject } from '@angular/core';
import { ApiService } from './api'; // Tu cliente centralizado que ya hicimos
import { Observable } from 'rxjs';

export class BaseService<T> {
  protected api = inject(ApiService);
  
  // Se le pasa el endpoint en el constructor (ej: 'users', 'categories')
  constructor(protected endpoint: string) {}

  getAll(): Observable<T[]> {
    return this.api.get<T[]>(this.endpoint);
  }

  getById(id: string): Observable<T> {
    return this.api.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.api.post<T>(this.endpoint, data);
  }

  // Aquí puedes añadir update, delete, etc.
}