import { Role } from './enums';
export interface User {
  id: string;
  firebaseId: string;
  email: string;
  name: string | null;
  role: Role;
  phone: string | null;
  bio: string | null;
  createdAt: string; // En el front llegan como strings ISO
  updatedAt: string;
  deletedAt: string | null;
  
  // Opcionales por si haces un include en Prisma
  provider?: any; 
  devices?: any[];
  bookings?: any[];
}