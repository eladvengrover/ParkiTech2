import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import commonStyles from './commonStyles';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';

type ParkingStatusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ParkingStatus'>;
type ParkingStatusScreenRouteProp = RouteProp<RootStackParamList, 'ParkingStatus'>;

type Props = {
  navigation: ParkingStatusScreenNavigationProp;
};

const ParkingStatusScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<ParkingStatusScreenRouteProp>();

  const [parkingStatus, setParkingStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParkingStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://parkitect.azurewebsites.net/api/GetParkingsStatuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseBody = await response.json();

      if (response.status === 200) {
        setParkingStatus(responseBody);
      } else {
        Alert.alert('Error', responseBody.error || 'Failed to fetch parking status');
      }
    } catch (error) {
      console.error('Error fetching parking status:', error);
      Alert.alert('Error', 'An error occurred while fetching parking status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingStatus();

    // Set up an interval to fetch the parking status every 5 minutes (300000 ms)
    const intervalId = setInterval(fetchParkingStatus, 300000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Parking Status</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={parkingStatus}
          keyExtractor={(item) => item.parking_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={commonStyles.bookingItem}>
              <Text>Parking number: {item.parking_id}</Text>
              <Text>Status: {item.status}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ParkingStatusScreen;
