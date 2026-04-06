import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule, Eye, X, Receipt, CreditCard, Hash, Calendar, DollarSign, CheckCircle, AlertCircle, RotateCcw, Clock } from 'lucide-angular';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { lastValueFrom } from 'rxjs';
import { Transaction } from '../../core/models/entities';
import { TransactionService } from '../../core/services/transaction';
import { TransactionStatus } from '../../core/models/enums';

@Component({
    selector: 'app-transaction-list',
    standalone: true,
    imports: [DataTableComponent, LucideAngularModule, CommonModule, CurrencyPipe, DatePipe],
    templateUrl: './transaction-list.html'
})
export class TransactionList implements OnInit {
    // Iconos
    readonly EyeIcon = Eye;
    readonly XIcon = X;
    readonly ReceiptIcon = Receipt;
    readonly CardIcon = CreditCard;
    readonly HashIcon = Hash;
    readonly CalendarIcon = Calendar;
    readonly MoneyIcon = DollarSign;
    readonly SuccessIcon = CheckCircle;
    readonly ErrorIcon = AlertCircle;
    readonly RefundIcon = RotateCcw;
    readonly PendingIcon = Clock;

    // Columnas para la tabla
    transactionColumns = [
        { label: 'Referencia', key: 'reference' },
        { label: 'Monto', key: 'amount' },
        { label: 'Método', key: 'method' },
        { label: 'Estado', key: 'status' },
        { label: 'Fecha', key: 'createdAt' }
    ];

    private transactionService = inject(TransactionService);
    transactions = signal<Transaction[]>([]);
    isLoading = signal(false);

    // Detalle
    showDetails = signal(false);
    selectedTransaction = signal<Transaction | null>(null);

    ngOnInit() {
        this.loadTransactions();
    }

    async loadTransactions() {
        this.isLoading.set(true);
        try {
            const data = await lastValueFrom(this.transactionService.getAll());
            this.transactions.set(data);
        } catch (error) {
            console.error('Error loading transactions', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    openDetails(tx: Transaction) {
        this.selectedTransaction.set(tx);
        this.showDetails.set(true);
    }

    getStatusStyles(status: TransactionStatus): string {
        const base = 'px-3 py-1 rounded-full text-[10px] font-black border ';
        const map: Record<TransactionStatus, string> = {
            [TransactionStatus.COMPLETED]: base + 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            [TransactionStatus.PENDING]: base + 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            [TransactionStatus.FAILED]: base + 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            [TransactionStatus.REFUNDED]: base + 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        };
        return map[status] || base + 'bg-slate-500/10 text-slate-500';
    }
}