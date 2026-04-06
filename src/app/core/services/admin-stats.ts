import { Injectable } from '@angular/core';
import { BaseService } from './base';
import { DashboardStats } from '../models/entities';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminStatsService extends BaseService<DashboardStats> {
    constructor() {
        super('admin-stats'); // Ajustado a la ruta del controlador de Nest
    }

    getSummary(): Observable<DashboardStats> {
        return this.api.get<DashboardStats>(`${this.endpoint}/summary`);
    }

    getRevenueHistory(): Observable<any[]> {
        return this.api.get<any[]>(`${this.endpoint}/revenue-history`);
    }
}