// screens/TenantMainScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the path as needed

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TenantMain'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const TenantMainScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚗 ParkiTect</Text>
      <Button title="Create a new booking" onPress={() => navigation.navigate('CreateBookingScreen')} />
      <View style={styles.spacer} />
      <Button title="View existing (future) bookings" onPress={() => navigation.navigate('ViewBookingScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 40,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  spacer: {
    height: 20,
  },
});

export default TenantMainScreen;
