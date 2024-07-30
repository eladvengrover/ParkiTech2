import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { RouteProp, useRoute } from '@react-navigation/native';

type TenantMainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TenantMain'>;
type TenantMainScreenRouteProp = RouteProp<RootStackParamList, 'TenantMain'>;

type Props = {
  navigation: TenantMainScreenNavigationProp;
};

const TenantMainScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<TenantMainScreenRouteProp>();
  const { tenantId: tenantId } = route.params;

  const handleCreateBooking = () => {
    navigation.navigate('CreateBooking', { tenantId: tenantId });
  };

  const handleViewBooking = () => {
    navigation.navigate('ViewBooking', { tenantId: tenantId });
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
