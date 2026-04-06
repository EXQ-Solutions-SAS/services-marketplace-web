import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule, Eye, X, Tag, DollarSign, Info, Calendar, User, LayoutGrid } from 'lucide-angular';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { lastValueFrom } from 'rxjs';
import { Service } from '../../core/models/entities';
import { ServiceService } from '../../core/services/service';

@Component({
    selector: 'app-service-list',
    standalone: true,
    imports: [DataTableComponent, LucideAngularModule, CommonModule, CurrencyPipe, DatePipe],
    templateUrl: './service-list.html'
})
export class ServiceList implements OnInit {
    // Iconos
    readonly EyeIcon = Eye;
    readonly XIcon = X;
    readonly TagIcon = Tag;
    readonly PriceIcon = DollarSign;
    readonly InfoIcon = Info;
    readonly CalendarIcon = Calendar;
    readonly ProviderIcon = User;
    readonly CategoryIcon = LayoutGrid;

    // Columnas para la tabla
    serviceColumns = [
        { label: 'Servicio', key: 'title' },
        { label: 'Categoría', key: 'category' },
        { label: 'Precio/Hora', key: 'price' },
        { label: 'ID', key: 'id' }
    ];

    private serviceService = inject(ServiceService);
    services = signal<Service[]>([]);
    isLoading = signal(false);

    // Detalle
    showDetails = signal(false);
    selectedService = signal<Service | null>(null);

    ngOnInit() {
        this.loadServices();
    }

    async loadServices() {
        this.isLoading.set(true);
        try {
            const data = await lastValueFrom(this.serviceService.getAll());
            this.services.set(data);
        } catch (error) {
            console.error('Error loading services', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    openDetails(service: Service) {
        this.selectedService.set(service);
        this.showDetails.set(true);
    }

    calculateRating(reviews: any[] | undefined): string {
        if (!reviews || reviews.length === 0) return '0.0';
        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }
}