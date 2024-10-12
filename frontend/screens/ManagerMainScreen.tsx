import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import AddUserModal from './AddUserComponent';
import AddParkingModal from './AddParkingComponent';
import { RouteProp, useRoute } from '@react-navigation/native';

type ManagerMainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ManagerMain'>;
type ManagerMainScreenRouteProp = RouteProp<RootStackParamList, 'ManagerMain'>;

type Props = {
  navigation: ManagerMainScreenNavigationProp;
};

const ManagerMainScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<ManagerMainScreenRouteProp>();
  const { managerId: managerId } = route.params;
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isAddParkingModalVisible, setAddParkingModalVisible] = useState(false);


  const createUser = async (username: string, password: string, isManager: boolean, buildingId: number) => {
    console.log('------------------------------------');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Is Manager:', isManager);
    console.log('Building Id:', buildingId);
    console.log('------------------------------------');

    const userData = {
      username: username,
      password: password,
      is_manager: isManager,
      building_id: buildingId,
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/CreateNewUser?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log('User created successfully:', responseBody);
        Alert.alert('Success', 'User added successfully');
        return true;
      } else {
        const responseBody = await response.json();
        console.error('Error creating user:', responseBody);
        Alert.alert('Error', responseBody.error || 'Failed to add user');
        return false;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
      return false;
    }
  };

  const createParking = async (parkingNumber: number, location: string, buildingId: number, isPermanentlyBlocked: boolean) => {
    console.log('------------------------------------');
    console.log('Parking Number:', parkingNumber);
    console.log('Location:', location);
    console.log('Building Id:', buildingId);
    console.log('Is Permanently Blocked:', isPermanentlyBlocked);
    console.log('------------------------------------');

    const parkingData = {
      parking_number: parkingNumber,
      location: location,
      building_id: buildingId,
      is_permanently_blocked: isPermanentlyBlocked
    };

    try {
      const response = await fetch("https://parkitect.azurewebsites.net/api/CreateNewParking?", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parkingData)
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log('Parking created successfully:', responseBody);
        Alert.alert('Success', 'Parking added successfully');
        return true;
      } else {
        const responseBody = await response.json();
        console.error('Error creating parking:', responseBody);
        Alert.alert('Error', responseBody.error || 'Failed to add parking');
        return false;
      }
    } catch (error) {
      console.error('Error creating parking:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
      return false;
    }
  };

  const handleAddUser = (username: string, password: string, isManager: boolean, buildingId: number) => {
    createUser(username, password, isManager, buildingId);
    setAddUserModalVisible(false);
  };

  const handleAddParking = (parkingNumber: number, location: string, buildingId: number, isPermanentlyBlocked: boolean) => {
    createParking(parkingNumber, location, buildingId, isPermanentlyBlocked);
    setAddParkingModalVisible(false);
  };

  const handleRemoveUser = () => {
    Alert.prompt(
      'Remove User',
      'Enter the username of the user to remove:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async (username) => {
            if (username) {
              try {
                const response = await fetch('https://parkitect.azurewebsites.net/api/RemoveUser?', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username }),
                });

                if (response.ok) {
                  Alert.alert('Success', 'User removed successfully');
                } else {
                  const responseText = response.text();
                  Alert.alert('Error', 'Failed to remove user');
                }
              } catch (error) {
                console.log(error);
                Alert.alert('Error', 'An error occurred. Please try again later.');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleRemoveParking = () => {
    Alert.prompt(
      'Remove Parking',
      'Enter the Parking ID of the parking to remove:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async (parking_id) => {
            if (parking_id) {
              try {
                const response = await fetch('https://parkitect.azurewebsites.net/api/RemoveParking?', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ parking_id }),
                });

                if (response.ok) {
                  Alert.alert('Success', 'Parking removed successfully');
                } else {
                  const responseText = response.text();
                  Alert.alert('Error', 'Failed to remove parking');
                }
              } catch (error) {
                console.log(error);
                Alert.alert('Error', 'An error occurred. Please try again later.');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleViewBuilding = () => {
    navigation.navigate('ViewBuilding', { managerId: managerId });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Manager Dashboard</Text>
      <TouchableOpacity style={commonStyles.button} onPress={() => setAddUserModalVisible(true)}>
        <Text style={commonStyles.buttonText}>Add User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.button} onPress={handleRemoveUser}>
        <Text style={commonStyles.buttonText}>Remove User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.button} onPress={() => setAddParkingModalVisible(true)}>
        <Text style={commonStyles.buttonText}>Add Parking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.button} onPress={handleRemoveParking}>
        <Text style={commonStyles.buttonText}>Remove Parking</Text>
      </TouchableOpacity>     
      <TouchableOpacity style={commonStyles.button} onPress={handleViewBuilding}>
        <Text style={commonStyles.buttonText}>View Parking Status</Text>
      </TouchableOpacity>

      <AddUserModal
        visible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onAddUser={handleAddUser}
      />
      <AddParkingModal
        visible={isAddParkingModalVisible}
        onClose={() => setAddParkingModalVisible(false)}
        onAddParking={handleAddParking}
      />
    </View>
  );
};

export default ManagerMainScreen;
