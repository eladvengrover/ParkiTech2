// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import GuestScreen from './screens/GuestScreen';
import TenantMainScreen from './screens/TenantMainScreen';
import ManagerMainScreen from './screens/ManagerMainScreen';
import CreateBookingScreen from './screens/CreateBookingScreen';
import ViewBookingScreen from './screens/ViewBookingScreen';
import GuestDirectionScreen from './screens/GuestDirectionScreen';
import EditBookingScreen from './screens/EditBookingScreen';
import ParkingStatusScreen from './screens/ParkingStatusScreen';
import ViewBuildingScreen from './screens/ViewBuildingScreen';
import EditParkingScreen from './screens/EditParkingScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Guest" component={GuestScreen} />
        <Stack.Screen name="TenantMain" component={TenantMainScreen} />
        <Stack.Screen name="ManagerMain" component={ManagerMainScreen} />
        <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
        <Stack.Screen name="ViewBooking" component={ViewBookingScreen} />
        <Stack.Screen name="GuestDirection" component={GuestDirectionScreen} />
        <Stack.Screen name="EditBooking" component={EditBookingScreen} />
        <Stack.Screen name="ParkingStatus" component={ParkingStatusScreen} />
        <Stack.Screen name="ViewBuilding" component={ViewBuildingScreen} />
        <Stack.Screen name="EditParking" component={EditParkingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
