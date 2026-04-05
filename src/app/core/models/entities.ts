import { Role, BookingStatus, TransactionStatus } from './enums';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  basePrice: number;
  services?: Service[]; // Relación OOO
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firebaseId: string;
  email: string;
  name?: string;
  role: Role;
  phone?: string;
  bio?: string;
  provider?: Provider; // Relación 1:1
  bookings?: Booking[];
  reviewsWritten?: Review[];
  reviewsReceived?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  user?: User;
  bio?: string;
  category: string;
  active: boolean;
  services?: Service[];
  bookings?: Booking[];
  // location se maneja como string o objeto según cómo lo envíe Nest (GeoJSON)
  location?: any; 
}

export interface Service {
  id: string;
  title: string;
  description: string;
  pricePerHour: number;
  categoryId: string;
  category?: Category; // Objeto Category en lugar de solo ID
  providerId: string;
  provider?: Provider;
  bookings?: Booking[];
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customer?: User;
  providerId: string;
  provider?: Provider;
  serviceId: string;
  service?: Service;
  hours: number;
  totalPrice: number;
  scheduledAt: string;
  status: BookingStatus;
  reviews?: Review[];
  transaction?: Transaction;
  createdAt: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  booking?: Booking;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  externalReference?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  bookingId: string;
  booking?: Booking;
  reviewerId: string;
  reviewer?: User;
  revieweeId: string;
  reviewee?: User;
  createdAt: string;
}