
export type Role = 'USER' | 'ADMIN';

export type VehicleType = 'car' | 'motorcycle' | 'truck';
export type VehicleSize = 'small' | 'medium' | 'large';
export type SlotStatus = 'available' | 'unavailable';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type SlotLocation = 'north' | 'south' | 'east' | 'west';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Vehicle {
  id: number;
  userId: number;
  plateNumber: string;
  vehicleType: VehicleType;
  size: VehicleSize;
  attributes?: {
    color?: string;
    model?: string;
    year?: number;
    [key: string]: any;
  };
  createdAt: string;
}

export interface ParkingSlot {
  id: number;
  slotNumber: string;
  size: VehicleSize;
  vehicleType: VehicleType;
  status: SlotStatus;
  location: SlotLocation;
}

export interface SlotRequest {
  id: number;
  userId: number;
  vehicleId: number;
  slotId?: number;
  slotNumber?: string;
  requestStatus: RequestStatus;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  user?: {
    name: string;
    email: string;
  };
}

export interface Log {
  id: number;
  userId: number;
  action: string;
  timestamp: string;
  userName?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface SearchParams {
  page: number;
  limit: number;
  search?: string;
}

export interface StatsData {
  totalVehicles: number;
  availableSlots: number;
  pendingRequests: number;
  occupiedSlots: number;
}

export interface ChartData {
  name: string;
  value: number;
}
