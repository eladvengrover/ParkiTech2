import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import commonStyles from './commonStyles';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';

type ViewBookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ViewBooking'>;
type ViewBookingScreenRouteProp = RouteProp<RootStackParamList, 'ViewBooking'>;

type Props = {
  navigation: ViewBookingScreenNavigationProp;
};

const formatDateTime = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

const ViewBookingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<ViewBookingScreenRouteProp>();
  const { tenantId } = route.params;

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://parkitect.azurewebsites.net/api/GetBookingsDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resident_id: tenantId }),
      });

      const responseBody = await response.json();

      if (response.status === 200) {
        console.log(responseBody);
        setBookings(responseBody);
      } else {
        const regex = /Bookings of resident ID \d{1,3} not found/;
        if (regex.test(responseBody.error)) {
          Alert.alert('No bookings yet');  
        } else {
          Alert.alert('Error', responseBody.error || 'Failed to fetch bookings');
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'An error occurred while fetching bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [])
  );

  const handlePress = (item: any) => {
    navigation.navigate('EditBooking', { 
      tenantId, 
      bookingId: item.id,
      guestName: item.guest_name, 
      vehicleNumber: item.vehicle_number, 
      startDateTime: item.start_date_time, 
      endDateTime: item.end_date_time,
      parkingId: item.parking_id
    });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Existing Bookings</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={commonStyles.bookingItem}>
              <Text>Guest: {item.guest_name}</Text>
              <Text>Vehicle Number: {item.vehicle_number}</Text>
              <Text>Start Date: {formatDateTime(item.start_date_time)}</Text>
              <Text>End Date: {formatDateTime(item.end_date_time)}</Text>
              <Text>Parking ID: {item.parking_id}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ViewBookingScreen;
