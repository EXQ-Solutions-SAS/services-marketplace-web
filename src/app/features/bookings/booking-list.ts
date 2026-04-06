import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule, Clock, CheckCircle, XCircle, CreditCard, Calendar, Eye, X, User, Hash, Activity, Info } from 'lucide-angular';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { lastValueFrom } from 'rxjs';
import { BookingService } from '../../core/services/booking';

@Component({
    selector: 'app-booking-list',
    standalone: true,
    imports: [DataTableComponent, LucideAngularModule, CommonModule, CurrencyPipe, DatePipe],
    templateUrl: './booking-list.html'
})
export class BookingList implements OnInit {
    // Iconos
    readonly Icons = { Clock, CheckCircle, XCircle, CreditCard, Calendar, Eye, X, User, Hash, Activity, Info };

    columns = [
        { label: 'Servicio', key: 'service' },
        { label: 'Cliente', key: 'customer' },
        { label: 'Fecha Programada', key: 'scheduledAt' },
        { label: 'Total', key: 'totalPrice' },
        { label: 'Estado', key: 'status' }
    ];

    private bookingService = inject(BookingService);
    bookings = signal<any[]>([]);

    // Señales para el Detalle
    showDetails = signal(false);
    selectedBooking = signal<any | null>(null);

    ngOnInit() { this.loadData(); }

    async loadData() {
        try {
            // Usamos el método de admin que arreglamos antes
            const data = await lastValueFrom(this.bookingService.getAll());
            this.bookings.set(data);
        } catch (e) { console.error(e); }
    }

    openDetails(booking: any) {
        this.selectedBooking.set(booking);
        this.showDetails.set(true);
    }

    getStatusStyles(status: string) {
        const styles: any = {
            'PENDING': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'ACCEPTED': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'PAID': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            'COMPLETED': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
            'CANCELLED': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        };
        return styles[status] || 'bg-slate-500/10 text-slate-500';
    }

    getStars(rating: number): number[] {
        return Array(rating).fill(0);
    }

    getReviewType(review: any, booking: any): string {
        // Si el ID del que escribe es igual al ID del cliente de la reserva
        if (review.reviewerId === booking.customerId) {
            return 'Reseña del Cliente al Proveedor';
        }
        return 'Reseña del Proveedor al Cliente';
    }
}