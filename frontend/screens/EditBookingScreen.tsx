import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
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
  const { id } = route.params;
  
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  useEffect(() => {
    // Fetch order details based on ID
    // This is just an example. Replace with actual data fetching logic.
    const fetchOrderDetails = async () => {
      const orderDetails = {
        vehicleNumber: '1234567',
        startDateTime: new Date(Date.now() + 3600 * 1000),
        endDateTime: new Date(Date.now() + 7200 * 1000),
      };
      setVehicleNumber(orderDetails.vehicleNumber);
      setStartDateTime(orderDetails.startDateTime);
      setEndDateTime(orderDetails.endDateTime);
    };
    fetchOrderDetails();
  }, [id]);

  const handleSave = () => {
    // Add logic to save the updated details
    console.log('Saving updated details:', {
      vehicleNumber,
      startDateTime,
      endDateTime,
    });
    // Future: Send data to DB

    Alert.alert('Success', 'Booking details updated successfully');
    navigation.goBack();
  };

  const handleDelete = () => {
    // Add logic to delete the order
    console.log('Deleting order with ID:', id);
    // Future: Send delete request to DB

    Alert.alert('Success', 'Booking deleted successfully');
    navigation.navigate('ViewBooking');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Edit Booking</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />
      {/* Add DateTimePicker for startDateTime and endDateTime */}
      <TextInput
        style={commonStyles.input}
        placeholder="Start Date and Time"
        value={formatDateTime(startDateTime)}
        editable={false}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="End Date and Time"
        value={formatDateTime(endDateTime)}
        editable={false}
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleSave}>
        <Text style={commonStyles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.deleteButton} onPress={handleDelete}>
        <Text style={commonStyles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditBookingScreen;
