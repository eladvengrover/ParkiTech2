// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleGuest = () => {
    navigation.navigate('Guest');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Welcome to ParkiTect 🚗</Text>
      <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
        <Text style={commonStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.button} onPress={handleGuest}>
        <Text style={commonStyles.buttonText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
