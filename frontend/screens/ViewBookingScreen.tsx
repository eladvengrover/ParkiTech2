// screens/ViewBookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ViewBookingScreen: React.FC = () => {
  const [invitationNumber, setInvitationNumber] = useState('');

  const handleContinue = () => {
    // Add logic to handle invitation number
    console.log('Invitation Number:', invitationNumber);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViewBookingScreen</Text>
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ViewBookingScreen;
