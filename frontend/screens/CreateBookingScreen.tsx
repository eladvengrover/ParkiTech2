// screens/CreateBookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles from './commonStyles';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type CreateBookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateBooking'>;
type CreateBookingScreenRouteProp = RouteProp<RootStackParamList, 'CreateBooking'>;

type Props = {
  navigation: CreateBookingScreenNavigationProp;
};

const CreateBookingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<CreateBookingScreenRouteProp>();
  const { tenantId: tenantId } = route.params;  
  
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    const validationRes = validateBooking();
    if (validationRes) {
      try {
        const success = await submitBooking();
        if (success) {
          Alert.alert('Success', 'Booking created successfully');
          navigation.goBack();
        } else {
          Alert.alert('Failure', 'Failed to create booking. Please try again.');
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
    if (!vehicleNumber || !startDateTime || !endDateTime) {
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
    console.log('Order Start Date and Time:', startDateTime);
    console.log('Order End Date and Time:', endDateTime);
    console.log('------------------------------------');

    console.log(startDateTime);
    console.log(endDateTime);

    const bookingData = {
      resident_id: tenantId,
      guest_name: "Shahar",  // TODO - Replace with actual data
      guest_car_number: vehicleNumber,
      booking_start: startDateTime.toISOString(),
      booking_end: endDateTime.toISOString(),
      status: "confirmed",
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/CreateNewBooking?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      const responseStatus = response.status;
      const responseBody = await response.json();
      const booking_id = responseBody.booking_id;
      const parking_id = responseBody.parking_id;

      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error creating booking:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return false;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Create a new booking</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          keyboardType="numeric"
        />
        <Button title="Select Start Date and Time" onPress={() => setShowStartPicker(true)} />
        {showStartPicker && (
          <DateTimePicker
            value={startDateTime}
            mode="datetime"
            display="default"
            onChange={handleStartChange}
          />
        )}
        <Text style={commonStyles.dateText}>Selected Start: {startDateTime.toLocaleString()}</Text>
        
        <Button title="Select End Date and Time" onPress={() => setShowEndPicker(true)} />
        {showEndPicker && (
          <DateTimePicker
            value={endDateTime}
            mode="datetime"
            display="default"
            onChange={handleEndChange}
          />
        )}
        <Text style={commonStyles.dateText}>Selected End: {endDateTime.toLocaleString()}</Text>
        
        <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
          <Text style={commonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateBookingScreen;
