// types.ts
export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Guest: undefined;
    TenantMain: { tenantId: number };
    CreateBooking: { tenantId: number };
    ViewBooking: { tenantId: number };
    GuestDirection: undefined;
    EditBooking: { tenantId: number, bookingId: number, guestName: string, vehicleNumber: string, startDateTime: Date, endDateTime: Date, parkingId: number};
    ManagerMain: {managerId: number};
    ParkingStatus: { managerId: number, buildingId: number };
    ViewBuilding: { managerId: number };
    GuestDirectionScreen: { parkingId: number }; 

  };
  