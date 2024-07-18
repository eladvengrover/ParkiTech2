// screens/CreateBookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles from './commonStyles';

const CreateBookingScreen: React.FC = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const validateAndSubmit = () => {
    const now = new Date();

    // Validation checks
    if (!vehicleNumber || !startDateTime || !endDateTime) {
      Alert.alert('Error', 'All fields must be filled.');
      return;
    }

    if (vehicleNumber.length < 7 || vehicleNumber.length > 8) {
      Alert.alert('Error', 'Invalid vehicle number.');
      return;
    }

    if (startDateTime <= now) {
      Alert.alert('Error', 'Invalid start date and time - start date and time must be in the future.');
      return;
    }

    if (endDateTime <= startDateTime) {
      Alert.alert('Error', 'Invalid end date and time - end date and time must be after the start date and time.');
      return;
    }

    submitBooking();

    // Add logic to handle form submission
    console.log('------------------------------------');
    console.log('Vehicle Number:', vehicleNumber);
    console.log('Order Start Date and Time:', startDateTime);
    console.log('Order End Date and Time:', endDateTime);
    console.log('------------------------------------');
    // Future: Send data to DB

    // Clear all fields
    setVehicleNumber('');
    setStartDateTime(new Date());
    setEndDateTime(new Date());
    setShowStartPicker(false);
    setShowEndPicker(false);
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

  const submitBooking = () => {

    const bookingData = {
      resident_id: "12345",  // Replace with actual data
      guest_name: "John Doe",  // Replace with actual data
      guest_car_number: vehicleNumber,  // Replace with actual data
      booking_start: startDateTime,  // Replace with actual data
      booking_end: endDateTime,  // Replace with actual data
      };


      fetch("https://parkitect.azurewebsites.net/api/CreateNewBooking?", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      }).then((response) => {
        console.log("log elad");
        return response.text();
      }).then((text) => {
        console.log(text);
      }).catch((error) => {
        console.error(error);
      });
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
        
        <TouchableOpacity style={commonStyles.button} onPress={validateAndSubmit}>
          <Text style={commonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateBookingScreen;
