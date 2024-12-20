import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useRoute } from '@react-navigation/native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type EditBookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditBooking'>;

type Props = {
  navigation: EditBookingScreenNavigationProp;
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

type EditBookingScreenRouteProp = RouteProp<RootStackParamList, 'EditBooking'>;

const EditBookingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<EditBookingScreenRouteProp>();
  const { tenantId, bookingId, guestName: initialGuestName, vehicleNumber: initialVehicleNumber, startDateTime: initialStartDateTime, endDateTime: initialEndDateTime, parkingNumber: initialparkingNumber, parkingId: initialParkingId} = route.params;
  const [guestName, setGuestName] = useState(initialGuestName)
  const [vehicleNumber, setVehicleNumber] = useState(initialVehicleNumber);
  const [startDateTime, setStartDateTime] = useState(() => {
    const startDate = new Date(initialStartDateTime);
    return startDate;
  });
  const [endDateTime, setEndDateTime] = useState(() => {
    const endtDate = new Date(initialEndDateTime);
    return endtDate;
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [parkingNumber, setparkingNumber] = useState(initialparkingNumber);

  const handleSave = async () => {
    const validationRes = validateBooking();
    if (validationRes) {
      try {
        const success = await updateBooking();
        if (success) {
          Alert.alert('Success', 'Booking details updated successfully');
          navigation.navigate('ViewBooking', { tenantId });
        } else {
          Alert.alert('Failure', 'Failed to update booking. Please try again.');
        }
      } catch (error) {
        console.error('Error updating booking:', error);
        Alert.alert('Error', 'An error occurred while updating the booking. Please try again later.');
      }
    } else {
      console.log('Invalid booking');
    }
  };

  const validateBooking = () => {
    const now = new Date();
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

  const updateBooking = async () => {
    const bookingData = {
      booking_id: bookingId,
      resident_id: tenantId,
      guest_name: guestName,
      guest_car_number: vehicleNumber,
      booking_start: startDateTime.toISOString(),
      booking_end: endDateTime.toISOString()
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/UpdateBooking?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error updating booking:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      return false;
    }
  };

  const handleDelete = async () => {
    try {
      const success = await deleteBooking();
      if (success) {
        navigation.navigate('TenantMain', { tenantId });
        Alert.alert('Success', 'Booking deleted successfully');
      } else {
        Alert.alert('Failure', 'Failed to delete booking. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      Alert.alert('Error', 'An error occurred while deleting the booking. Please try again later.');
    }
  };

  const deleteBooking = async () => {
    const bookingData = {
      booking_id: bookingId,
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/RemoveBooking?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error deleting booking:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
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

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Edit Your Booking</Text>

      {/* Guest Name Input */}
      <Text style={commonStyles.label}>Guest Name</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter Guest Name"
        value={guestName}
        onChangeText={setGuestName}
      />

      {/* Vehicle Number Input */}
      <Text style={commonStyles.label}>Vehicle Number</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
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
      <Text style={commonStyles.label}>Parking Number: {parkingNumber}</Text>

      {/* Save Button */}
      <TouchableOpacity style={commonStyles.button} onPress={handleSave}>
        <Text style={commonStyles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
  
      {/* Delete Button */}
      <TouchableOpacity style={commonStyles.deleteButton} onPress={handleDelete}>
        <Text style={commonStyles.buttonText}>Delete Booking</Text>
      </TouchableOpacity>
    </View>
  );
  
};

export default EditBookingScreen;
