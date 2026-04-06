import { Injectable } from '@angular/core';
import { BaseService } from './base';
import { User } from '../models/entities';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor() {
    super('users'); // Endpoint base
  }

}