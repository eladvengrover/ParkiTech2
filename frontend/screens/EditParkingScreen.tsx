import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type EditParkingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditParking'>;

type Props = {
  navigation: EditParkingScreenNavigationProp;
};

type EditParkingScreenRouteProp = RouteProp<RootStackParamList, 'EditParking'>;

const EditParkingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<EditParkingScreenRouteProp>();
  const { parkingId, parkingNumber: initialParkingNumber, location: initialLocation, isPermanentlyBlocked: initialBlockedStatus, buildingName, managerId, buildingId } = route.params;

  const [parkingNumber, setParkingNumber] = useState(initialParkingNumber);
  const [location, setLocation] = useState(initialLocation);
  const [isPermanentlyBlocked, setIsPermanentlyBlocked] = useState(initialBlockedStatus);

  useEffect(() => {
    // Fetch initial parking details (if necessary), prepopulate the form
  }, [parkingId]);

  const handleSave = async () => {
    if (!parkingNumber || !location) {
      Alert.alert('Error', 'All fields must be filled.');
      return;
    }

    const parkingData = {
      parking_id: parkingId,
      parking_number: parkingNumber,
      location,
      building_id: buildingId,
      is_permanently_blocked: isPermanentlyBlocked,
    };

    try {
      const response = await fetch('https://parkitect.azurewebsites.net/api/UpdateParkingDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkingData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Parking details updated successfully');
        navigation.navigate('ParkingStatus', { managerId, buildingId, buildingName });
      } else {
        const errorText = await response.text();
        console.error('Error updating parking:', errorText);
        Alert.alert('Failure', 'Failed to update parking. Please try again.');
      }
    } catch (error) {
      console.error('Error updating parking:', error);
      Alert.alert('Error', 'An error occurred while updating the parking. Please try again later.');
    }
  };

  const handleDelete = async () => {
    try {
      const success = await deleteParking();
      if (success) {
        navigation.navigate('ParkingStatus', { managerId, buildingId, buildingName });
        Alert.alert('Success', 'Parking deleted successfully');
      } else {
        Alert.alert('Failure', 'Failed to delete Parking. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting Parking:', error);
      Alert.alert('Error', 'An error occurred while deleting the Parking. Please try again later.');
    }
  };

  const deleteParking = async () => {
    const parkingData = {
      parking_id: parkingId,
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/RemoveParking?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkingData),
      });

      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error deleting Parking:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting Parking:', error);
      return false;
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Edit Parking</Text>
      
      <TextInput
        style={commonStyles.input}
        placeholder="Parking Number"
        value={parkingNumber.toString()}
        onChangeText={(text) => setParkingNumber(Number(text))}
        keyboardType="numeric"
      />
      
      <TextInput
        style={commonStyles.input}
        placeholder="Parking Instructions (Location)"
        value={location}
        onChangeText={setLocation}
      />
      
      <View style={commonStyles.switchContainer}>
        <Text style={commonStyles.label}>Is Permanently Blocked:</Text>
        <Switch
          value={isPermanentlyBlocked}
          onValueChange={setIsPermanentlyBlocked}
        />
      </View>
      
      <Text style={commonStyles.label}>Building: {buildingName}</Text>
      
      <TouchableOpacity style={commonStyles.button} onPress={handleSave}>
        <Text style={commonStyles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.deleteButton} onPress={handleDelete}>
        <Text style={commonStyles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditParkingScreen;
