// types.ts
export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Guest: undefined;
    TenantMain: { tenantId: number };
    CreateBooking: { tenantId: number };
    ViewBooking: { tenantId: number };
    GuestDirection: undefined;
    EditBooking: { tenantId: number, bookingId: number, vehicleNumber: string, startDateTime: Date, endDateTime: Date, parkingNumber: number, parkingId: number};
    ManagerMain: {managerId: number};
    ParkingStatus: { managerId: number, buildingId: number, buildingName: string};
    ViewBuilding: { managerId: number };
    EditParking: { parkingId: number, parkingNumber: number, location: string, isPermanentlyBlocked: boolean, buildingName: string, managerId: number, buildingId: number};
    GuestDirection: { parkingId: number }; 
  };
  