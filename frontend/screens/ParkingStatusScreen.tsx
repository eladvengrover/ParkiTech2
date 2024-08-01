import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
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
        body: JSON.stringify({ }),
      });

      const responseBody = await response.json();

      if (response.status === 200) {
        // Sort the parking statuses by parking_id
        const sortedStatus = responseBody.sort((a: any, b: any) => a.parking_id - b.parking_id);
        setParkingStatus(sortedStatus);
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

    const intervalId = setInterval(fetchParkingStatus, 60000); // Update every 1 minute

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const renderRow = ({ item }: { item: any }) => {
    const isOccupied = item.status === 'Occupied';
    return (
      <View style={[commonStyles.row, isOccupied ? commonStyles.occupied : commonStyles.free]}>
        <Text style={commonStyles.cell}>{item.parking_id}</Text>
        <Text style={commonStyles.cell}>{item.status}</Text>
        <Text style={commonStyles.cell}>{isOccupied ? item.booking_id || '-' : '-'}</Text>
      </View>
    );
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Parking Statuses</Text>
      <View style={commonStyles.table}>
        <View style={commonStyles.headerRow}>
          <Text style={commonStyles.headerCell}>Parking ID</Text>
          <Text style={commonStyles.headerCell}>Status</Text>
          <Text style={commonStyles.headerCell}>Booking ID</Text>
        </View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={parkingStatus}
            renderItem={renderRow}
            keyExtractor={(item) => item.parking_id.toString()}
          />
        )}
      </View>
    </View>
  );
};

export default ParkingStatusScreen;
