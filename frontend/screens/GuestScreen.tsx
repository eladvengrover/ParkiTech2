// screens/GuestScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import commonStyles from './commonStyles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Guest'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};
const GuestScreen: React.FC<Props> = ({ navigation }) => {
  const [InvitationNumber, setInvitationNumber] = useState('');

  const handleContinue = () => {
    // Add logic to handle invitation number
    navigation.navigate('GuestDirection');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Enter Invitation Number</Text>
      <TextInput
          style={commonStyles.input}
          placeholder="Invitation Number"
          value={InvitationNumber}
          onChangeText={setInvitationNumber}
          keyboardType="numeric"
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleContinue}>
        <Text style={commonStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuestScreen;
