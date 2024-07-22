// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async() => {
    console.log('Logging in with:', username, password);
    const userData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('https://parkitect.azurewebsites.net/api/UserLogin?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const responseStatus = response.status;
      console.log('Response Status:', response.status);
      console.log('Response Text:', await response.text());

      if (responseStatus == 200) {
        navigation.navigate('TenantMain');
      } else {
        Alert.alert(
          "Login Failed",
          "Incorrect username or password, please try again",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert(
        "Error",
        "An error occurred. Please try again later.",
        [{ text: "OK" }]
      );
    }





    
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Login</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleLoginSubmit}>
        <Text style={commonStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
