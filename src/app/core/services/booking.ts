import { Injectable } from '@angular/core';
import { BaseService } from './base';
import { Booking } from '../models/entities';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService extends BaseService<Booking> {
    constructor() {
        super('bookings'); // Endpoint base
    }

    override getAll(): Observable<Booking[]> {
        return this.api.get<Booking[]>(`${this.endpoint}/admin`); // bookings/admin
    }
}