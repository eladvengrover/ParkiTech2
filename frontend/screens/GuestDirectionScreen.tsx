// screens/GuestScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import commonStyles from './commonStyles';

const GuestDirectionScreen: React.FC = () => {

  const handleContinue = () => {
    // Add logic to handle invitation number
    console.log('GuestDirectionScreen');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Show Map Direction Here</Text>
    </View>
  );
};

export default GuestDirectionScreen;
