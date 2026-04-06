import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LucideAngularModule, Star, User, MessageSquare, Calendar, Eye, X, ShieldCheck } from 'lucide-angular';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { lastValueFrom } from 'rxjs';
import { ReviewService } from '../../core/services/review';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [DataTableComponent, LucideAngularModule, CommonModule, DatePipe],
  templateUrl: './review-list.html'
})
export class ReviewList implements OnInit {
  readonly Icons = { Star, User, MessageSquare, Calendar, Eye, X, ShieldCheck };

  columns = [
    { label: 'Autor (Reviewer)', key: 'reviewer' },
    { label: 'Calificación', key: 'rating' },
    { label: 'Receptor (Reviewee)', key: 'reviewee' },
    { label: 'Fecha', key: 'createdAt' }
  ];

  private reviewService = inject(ReviewService);
  reviews = signal<any[]>([]);
  
  showDetails = signal(false);
  selectedReview = signal<any | null>(null);

  ngOnInit() { this.loadData(); }

  async loadData() {
    try {
      const data = await lastValueFrom(this.reviewService.getAll());
      this.reviews.set(data);
    } catch (e) { console.error(e); }
  }

  openDetails(review: any) {
    this.selectedReview.set(review);
    this.showDetails.set(true);
  }

  getStars(rating: number) {
    return Array(rating).fill(0);
  }
}