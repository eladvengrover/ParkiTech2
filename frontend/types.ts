// types.ts
export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Guest: undefined;
    TenantMain: { tenantId: number };
    CreateBooking: { tenantId: number };
    ViewBooking: { tenantId: number };
    GuestDirection: undefined;
    EditBooking: { tenantId: number, bookingId: number, vehicleNumber: string, startDateTime: Date, endDateTime: Date, parkingId: number};
    ManagerMain: undefined;
    ParkingStatus: undefined;
  };
  