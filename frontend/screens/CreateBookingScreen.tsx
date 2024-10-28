// screens/CreateBookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles from './commonStyles';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const TIMEZONE_HOURS_OFFSET = 2;

type CreateBookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateBooking'>;
type CreateBookingScreenRouteProp = RouteProp<RootStackParamList, 'CreateBooking'>;

type Props = {
  navigation: CreateBookingScreenNavigationProp;
};

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

const CreateBookingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<CreateBookingScreenRouteProp>();
  const { tenantId: tenantId } = route.params;  
  
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [startDateTime, setStartDateTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour to the current time
    return now;
  });
  const [endDateTime, setEndDateTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // Add 2 hour to the current time
    return now;
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    const validationRes = validateBooking();
    if (validationRes) {
      try {
        const response = await submitBooking();
        if (response.success) {
          Alert.alert('Success', 'Booking created successfully');
          navigation.goBack();
        } else {
          Alert.alert('Failure', response.data);
        }
      } catch (error) {
        console.error('Error creating booking:', error);
        Alert.alert('Error', 'An error occurred while creating the booking. Please try again later.');
      }
    } else {
      console.log('Invalid booking');
    }
  };

  const handleStartChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDateTime;
    setShowStartPicker(false);
    setStartDateTime(currentDate);
  };

  const handleEndChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDateTime;
    setShowEndPicker(false);
    setEndDateTime(currentDate);
  };

  const validateBooking = () => {
    const now = new Date();

    // Validation checks
    if (!vehicleNumber || !guestName || !startDateTime || !endDateTime) {
      Alert.alert('Error', 'All fields must be filled.');
      return false;
    }
    if (vehicleNumber.length < 7 || vehicleNumber.length > 8) {
      Alert.alert('Error', 'Invalid vehicle number.');
      return false;
    }
    if (startDateTime <= now) {
      Alert.alert('Error', 'Invalid start date and time - start date and time must be in the future.');
      return false;
    }
    if (endDateTime <= startDateTime) {
      Alert.alert('Error', 'Invalid end date and time - end date and time must be after the start date and time.');
      return false;
    }
    return true;
  };

  const submitBooking = async () => {
    console.log('------------------------------------');
    console.log('Vehicle Number:', vehicleNumber);
    console.log('Guest Name:', guestName);
    console.log('Order Start Date and Time:', new Date(startDateTime.getTime() + TIMEZONE_HOURS_OFFSET * 60 * 60 * 1000).toISOString());
    console.log('Order End Date and Time:', new Date(endDateTime.getTime() + TIMEZONE_HOURS_OFFSET * 60 * 60 * 1000).toISOString());
    console.log('------------------------------------');

    const localizedStartDateTime = new Date(startDateTime.getTime() + TIMEZONE_HOURS_OFFSET * 60 * 60 * 1000);
    const localizedEndDateTime = new Date(endDateTime.getTime() + TIMEZONE_HOURS_OFFSET * 60 * 60 * 1000);

    const bookingData = {
      resident_id: tenantId,
      guest_name: guestName,
      guest_car_number: vehicleNumber,
      booking_start: localizedStartDateTime.toISOString(),
      booking_end: localizedEndDateTime.toISOString()
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/CreateNewBooking?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      const responseBody = await response.json();
      const booking_id = responseBody.booking_id;
      const parking_id = responseBody.parking_id;

      if (response.ok) {
        return { success: true, data: "Success" };
      } else {
        console.error('Error creating booking:', responseBody.error);
        return { success: false, data: responseBody.error };
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, data: error };
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Create a new booking</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Guest Name"  // New input for guest name
          value={guestName}
          onChangeText={setGuestName}
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          keyboardType="numeric"
        />
        {/* Start Time Section */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.label}>Start Time</Text>
        <Button title="Choose Start Time" onPress={() => setShowStartPicker(prevState => !prevState)} // Toggle start picker
      />
        {showStartPicker && (
          <DateTimePicker
            value={startDateTime}
            mode="datetime"
            display="spinner"
            onChange={handleStartChange}
          />
        )}
        <Text style={commonStyles.dateText}>Selected Start: {formatDateTime(startDateTime)}</Text>
      </View>
  
      {/* End Time Section */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.label}>End Time</Text>
        <Button title="Choose End Time" onPress={() => setShowEndPicker(prevState => !prevState)} // Toggle end picker
      />
        {showEndPicker && (
          <DateTimePicker
            value={endDateTime}
            mode="datetime"
            display="spinner"
            onChange={handleEndChange}
          />
        )}
        <Text style={commonStyles.dateText}>Selected End: {formatDateTime(endDateTime)}</Text>
      </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
          <Text style={commonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateBookingScreen;
