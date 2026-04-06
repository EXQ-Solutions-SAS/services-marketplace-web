import { Injectable } from "@angular/core";
import { BaseService } from "./base";
import { Transaction } from "../models/entities";

@Injectable({ providedIn: 'root' })
export class TransactionService extends BaseService<Transaction> {
  constructor() {
    super('payments');
  }
}