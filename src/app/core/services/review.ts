import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable({ providedIn: 'root' })
export class ReviewService extends BaseService<any> {
  constructor() {
    super('reviews');
  }
}