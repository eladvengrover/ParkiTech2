// screens/TenantMainScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; 


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TenantMain'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


const TenantMainScreen: React.FC<Props> = ({ navigation }) => {

  const handleCreateBooking = () => {
    navigation.navigate('CreateBooking');
  };

  const handleViewBooking = () => {
    navigation.navigate('ViewBooking');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Welcome Tenant</Text>
      <TouchableOpacity style={commonStyles.button} onPress={handleCreateBooking}>
        <Text style={commonStyles.buttonText}>Create a new booking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.button} onPress={handleViewBooking}>
        <Text style={commonStyles.buttonText}>View existing bookings</Text>
      </TouchableOpacity>
    </View>
  );
};


export default TenantMainScreen;
