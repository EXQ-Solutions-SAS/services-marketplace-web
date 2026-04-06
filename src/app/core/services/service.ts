import { Injectable } from '@angular/core';
import { BaseService } from './base';
import { Service } from '../models/entities';

@Injectable({ providedIn: 'root' })
export class ServiceService extends BaseService<Service> {
  constructor() {
    super('services'); // Endpoint base
  }

}