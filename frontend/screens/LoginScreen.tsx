import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import commonStyles from './commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSuccessLogin = (responseBody: any) => {
    const tenantId = responseBody.tenant_id;
    const isManager = responseBody.is_manager;

    if (isManager) {
      navigation.navigate('ManagerMain');
    } else {
      navigation.navigate('TenantMain', { tenantId: tenantId });
    }
  };

  const handleLoginSubmit = async () => {
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

        // Handle cases where response is empty or not JSON
        let responseBody;
        try {
            responseBody = await response.json();
        } catch (error) {
            console.error('Error parsing response:', error);
            Alert.alert(
                "Error",
                "An error occurred while processing the response. Please try again later.",
                [{ text: "OK" }]
            );
            return;
        }

        console.log('Response Status:', responseStatus);
        console.log('Response Body:', responseBody);

        if (responseStatus == 200) {
            handleSuccessLogin(responseBody);
        } else {
            Alert.alert(
                "Login Failed",
                responseBody.error || "Incorrect username or password, please try again",
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
