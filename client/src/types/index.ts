export interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
    address: string;
    dateOfBirth: string;
    joinDate: string;
    rating: number;
    tripCount: number;
    profileImage: string;
    operatorLevel: string;
    totalVehicles: number;
    kycVerified: boolean;
    insuranceStatus: 'valid' | 'expired' | 'pending';
    activeBookings: number;
    completedTrips: number;
    cancelledTrips: number;
    preferredAreas: string[];
    languages: string[];
    documents: {
      type: string;
      verified: boolean;
      expiryDate?: string;
    }[];
  }
  
  export interface Vehicle {
    id: string;
    driverId: string;
    name: string;
    type: string;
    model: string;
    year: number;
    plateNumber: string;
    description: string;
    status: 'available' | 'rented' | 'maintenance';
    rate: number;
    image: string;
  }