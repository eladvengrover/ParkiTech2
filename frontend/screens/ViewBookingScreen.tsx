// screens/ViewBookingScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import commonStyles from './commonStyles';

const staticBookings = [
  {
    id: '1',
    vehicleNumber: '1234567',
    startDateTime: new Date(Date.now() + 3600 * 1000),
    endDateTime: new Date(Date.now() + 7200 * 1000),
  },
  {
    id: '2',
    vehicleNumber: '2345678',
    startDateTime: new Date(Date.now() + 10800 * 1000),
    endDateTime: new Date(Date.now() + 14400 * 1000),
  },
  {
    id: '3',
    vehicleNumber: '1234567',
    startDateTime: new Date(Date.now() + 3600 * 1000),
    endDateTime: new Date(Date.now() + 7200 * 1000),
  },
  {
    id: '4',
    vehicleNumber: '2345678',
    startDateTime: new Date(Date.now() + 10800 * 1000),
    endDateTime: new Date(Date.now() + 14400 * 1000),
  },
  {
    id: '5',
    vehicleNumber: '1234567',
    startDateTime: new Date(Date.now() + 3600 * 1000),
    endDateTime: new Date(Date.now() + 7200 * 1000),
  },
  {
    id: '6',
    vehicleNumber: '2345678',
    startDateTime: new Date(Date.now() + 10800 * 1000),
    endDateTime: new Date(Date.now() + 14400 * 1000),
  },
  {
    id: '7',
    vehicleNumber: '1234567',
    startDateTime: new Date(Date.now() + 3600 * 1000),
    endDateTime: new Date(Date.now() + 7200 * 1000),
  },
  {
    id: '8',
    vehicleNumber: '2345678',
    startDateTime: new Date(Date.now() + 10800 * 1000),
    endDateTime: new Date(Date.now() + 14400 * 1000),
  },
  {
    id: '9',
    vehicleNumber: '1234567',
    startDateTime: new Date(Date.now() + 3600 * 1000),
    endDateTime: new Date(Date.now() + 7200 * 1000),
  },
  {
    id: '10',
    vehicleNumber: '2345678',
    startDateTime: new Date(Date.now() + 10800 * 1000),
    endDateTime: new Date(Date.now() + 14400 * 1000),
  },
];

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const ViewBookingScreen: React.FC<Props> = ({ navigation }) => {

  const handlePress = (id: string) => {
    navigation.navigate('EditBooking', { id });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Existing Bookings</Text>
      <FlatList
        data={staticBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.id)} style={commonStyles.bookingItem}>
            <Text>Vehicle Number: {item.vehicleNumber}</Text>
            <Text>Start Date: {formatDateTime(item.startDateTime)}</Text>
            <Text>End Date: {formatDateTime(item.endDateTime)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ViewBookingScreen;
