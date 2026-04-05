import { Injectable } from '@angular/core';
import { BaseService } from './base';
import { Category } from '../models/entities';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService<Category> {
  constructor() {
    super('categories'); // Endpoint base
  }

  // Método específico para el PATCH de tu captura
  update(id: string, data: Partial<Category>): Observable<Category> {
    return this.api.patch<Category>(`${this.endpoint}/${id}`, data);
  }

  // Método específico para el DELETE
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}