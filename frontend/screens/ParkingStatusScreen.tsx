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
  const { managerId, buildingId, buildingName } = route.params;

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
        body: JSON.stringify({ building_id: buildingId }),
      });

      const responseBody = await response.json();

      if (response.status === 200) {
        const sortedStatus = responseBody.sort((a: any, b: any) => a.parking_number - b.parking_number);
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

  useFocusEffect(
    React.useCallback(() => {
      fetchParkingStatus();
    }, [])
  );

  const handlePress = (parkingId: number, parkingNumber: number, location: string, isPermanentlyBlocked: boolean) => {
    navigation.navigate('EditParking', {
      parkingId,
      parkingNumber,
      location,
      isPermanentlyBlocked,
      buildingName,
      managerId,
      buildingId
    });
  };
  

  const renderRow = ({ item }: { item: any }) => {
    const isOccupied = item.status === 'Occupied';
    const isBlocked = item.is_permanently_blocked === true;
  
    let rowStyle = commonStyles.free;
    if (isBlocked) {
      rowStyle = commonStyles.blocked;
    } else if (isOccupied) {
      rowStyle = commonStyles.occupied;
    }
  
    return (
      <TouchableOpacity
        onPress={() => handlePress(
          item.parking_id,
          item.parking_number,
          item.location,
          item.is_permanently_blocked
        )}
      >
        <View style={[commonStyles.row, rowStyle]}>
        <Text style={commonStyles.cell}>{item.parking_id}</Text>
          <Text style={commonStyles.cell}>{item.parking_number}</Text>
          <Text style={commonStyles.cell}>{item.status}</Text>
          <Text style={commonStyles.cell}>{isOccupied ? item.booking_id || '-' : '-'}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Parking Statuses</Text>
      <View style={commonStyles.table}>
        <View style={commonStyles.headerRow}>
        <Text style={commonStyles.headerCell}>Parking ID</Text>
          <Text style={commonStyles.headerCell}>Parking Number</Text>
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
