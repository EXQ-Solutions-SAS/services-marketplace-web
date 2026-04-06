import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, DollarSign, Users, CalendarCheck, TrendingUp } from 'lucide-angular';
import { NgApexchartsModule } from 'ng-apexcharts'; // Importar esto
import { StatCard } from './stat-card';
import { AdminStatsService } from '../../core/services/admin-stats';
import { DashboardStats } from '../../core/models/entities';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, StatCard, NgApexchartsModule],
    template: `
    <div class="p-8 space-y-10 animate-in fade-in duration-700">
    <div class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
        <h1 class="text-4xl font-black text-white uppercase tracking-tighter italic">Business Intelligence</h1>
        <p class="text-slate-500 text-sm font-medium italic">Dashboard Operativo de la Plataforma</p>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Últimos 30 días
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @if (stats(); as data) {
            <app-stat-card 
                label="Ventas" 
                [value]="data.cards.revenue" 
                [trend]="data.cards.revenueGrowth" 
                [icon]="Icons.DollarSign" 
                [isCurrency]="true" 
                glowClass="bg-emerald-500" 
                iconColor="text-emerald-400">
            </app-stat-card>

            <app-stat-card 
                label="Usuarios" 
                [value]="data.cards.users" 
                [trend]="5.4" 
                [icon]="Icons.Users" 
                glowClass="bg-blue-500" 
                iconColor="text-blue-400">
            </app-stat-card>

            <app-stat-card 
                label="Reservas" 
                [value]="data.cards.bookings" 
                [trend]="-1.2" 
                [icon]="Icons.CalendarCheck" 
                glowClass="bg-primary-orange" 
                iconColor="text-primary-orange">
            </app-stat-card>

            <app-stat-card 
                label="Tasa Conversión" 
                [value]="data.cards.pendingRate" 
                [trend]="0.8" 
                [icon]="Icons.TrendingUp" 
                [isPercent]="true" 
                glowClass="bg-indigo-500" 
                iconColor="text-indigo-400">
            </app-stat-card>
        } @else {
            <div class="col-span-4 flex justify-center p-12">
                <div class="text-white animate-pulse font-black italic uppercase tracking-widest">
                    Cargando métricas de inteligencia...
                </div>
            </div>
        }
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] backdrop-blur-sm">
        <div class="flex justify-between items-start mb-6">
            <h4 class="text-xs font-black text-white uppercase tracking-widest italic px-2 border-l-2 border-primary-orange">Histórico de Ventas</h4>
        </div>
        <apx-chart [series]="areaChartOptions.series" [chart]="areaChartOptions.chart" [xaxis]="areaChartOptions.xaxis" [stroke]="areaChartOptions.stroke" [colors]="areaChartOptions.colors" [fill]="areaChartOptions.fill" [grid]="areaChartOptions.grid" [dataLabels]="areaChartOptions.dataLabels"></apx-chart>
        </div>

        <div class="bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] backdrop-blur-sm">
        <h4 class="text-xs font-black text-white uppercase tracking-widest italic mb-6 px-2 border-l-2 border-blue-400">Demanda por Categoría</h4>
        <apx-chart [series]="donutChartOptions.series" [chart]="donutChartOptions.chart" [labels]="donutChartOptions.labels" [colors]="donutChartOptions.colors" [plotOptions]="donutChartOptions.plotOptions" [stroke]="donutChartOptions.stroke" [legend]="donutChartOptions.legend"></apx-chart>
        </div>
    </div>
    </div>
  `
})
export class Dashboard implements OnInit {
    private statsService = inject(AdminStatsService);

    stats = signal<DashboardStats | null>(null);

    public readonly Icons = {
        DollarSign,
        Users,
        CalendarCheck,
        TrendingUp
    };

    // Opciones de gráficas
    public areaChartOptions: any;
    public donutChartOptions: any;

    ngOnInit() {
        this.initChartOptions(); // Inicializamos estructuras vacías
        this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            // 1. Cargar KPIs y Dona
            const summary = await lastValueFrom(this.statsService.getSummary());
            this.stats.set(summary);

            // Actualizar Dona
            this.donutChartOptions.series = summary.charts.categories.map(c => c.value);
            this.donutChartOptions.labels = summary.charts.categories.map(c => c.name);

            // 2. Cargar Historial de Ventas (Gráfica de Área)
            const history = await lastValueFrom(this.statsService.getRevenueHistory());

            // Mapeamos la data de PostgreSQL: "date" -> X, "total" -> Y
            this.areaChartOptions.series = [{
                name: "Ingresos",
                data: history.map(item => Number(item.total))
            }];

            this.areaChartOptions.xaxis = {
                categories: history.map(item => {
                    const d = new Date(item.date);
                    return d.toLocaleDateString('es-ES', { month: 'short' }); // Ej: "ene", "feb"
                })
            };

        } catch (error) {
            console.error("Error loading dashboard metrics", error);
        }
    }

    private initChartOptions() {
        // Configuraciones base (estilos, colores, degradados)
        this.areaChartOptions = {
            series: [], // Empieza vacío hasta que llegue la data
            chart: { height: 350, type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
            colors: ["#FF6600"],
            dataLabels: { enabled: false },
            stroke: { curve: "smooth", width: 4 },
            fill: {
                type: "gradient",
                gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.0, stops: [0, 90, 100] }
            },
            grid: { borderColor: "rgba(255,255,255,0.05)", strokeDashArray: 3 },
            xaxis: { categories: [], axisBorder: { show: false }, axisTicks: { show: false } },
            tooltip: { theme: 'dark', x: { show: true } }
        };

        this.donutChartOptions = {
            series: [],
            labels: [],
            chart: { type: "donut", height: 380, foreColor: '#94a3b8' },
            colors: ["#FF6600", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"],
            plotOptions: {
                pie: {
                    donut: {
                        size: '80%',
                        labels: {
                            show: true,
                            total: { show: true, label: 'Servicios', color: '#fff', fontSize: '14px', fontWeight: '900' }
                        }
                    }
                }
            },
            stroke: { show: false },
            legend: { position: 'bottom', fontSize: '12px', fontWeight: 'bold' }
        };
    }
}