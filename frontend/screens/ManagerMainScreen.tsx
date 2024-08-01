import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import AddUserModal from './AddUserComponent';
import { RouteProp } from '@react-navigation/native';

type ManagerMainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ManagerMain'>;
type ManagerMainScreenRouteProp = RouteProp<RootStackParamList, 'TenantMain'>;

type Props = {
  navigation: ManagerMainScreenNavigationProp;
};

const ManagerMainScreen: React.FC<Props> = ({ navigation }) => {
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);

  const createUser = async (username: string, password: string, isManager: boolean) => {
    console.log('------------------------------------');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Is Manager:', isManager);
    console.log('------------------------------------');

    const userData = {
      username: username,
      password: password,
      is_manager: isManager,
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

  const handleAddUser = (username: string, password: string, isManager: boolean) => {
    createUser(username, password, isManager);
    setAddUserModalVisible(false);
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

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Manager Dashboard</Text>
      <TouchableOpacity style={commonStyles.button} onPress={() => setAddUserModalVisible(true)}>
        <Text style={commonStyles.buttonText}>Add User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.button} onPress={handleRemoveUser}>
        <Text style={commonStyles.buttonText}>Remove User</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('ParkingStatus')}>
        <Text style={commonStyles.buttonText}>View Parking Status</Text>
      </TouchableOpacity>

      <AddUserModal
        visible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onAddUser={handleAddUser}
      />
    </View>
  );
};

export default ManagerMainScreen;
