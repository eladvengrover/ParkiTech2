import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import commonStyles from './commonStyles';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';

type ViewBuildingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ViewBuilding'>;
type ViewBuildingScreenRouteProp = RouteProp<RootStackParamList, 'ViewBuilding'>;

type Props = {
  navigation: ViewBuildingScreenNavigationProp;
};


const ViewBuildingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<ViewBuildingScreenRouteProp>();
  const { managerId : managerId } = route.params;

  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://parkitect.azurewebsites.net/api/GetBuildingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manager_id: managerId }),
      });

      const responseBody = await response.json();

      if (response.status === 200) {
        setBuildings(responseBody);
      } else {
        const regex = /Building of Manager ID \d{1,3} not found/;
        if (regex.test(responseBody.error)) {
          Alert.alert('No bookings yet');  
        } else {
          Alert.alert('Error', responseBody.error || 'Failed to fetch buildings');
        }
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      Alert.alert('Error', 'An error occurred while fetching buildings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBuildings();
    }, [])
  );

  const handlePress = (item: any) => {
    navigation.navigate('ParkingStatus', { 
      managerId, 
      buildingId: item.building_id, 
    });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Buildings</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={buildings}
          keyExtractor={(item) => item.building_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={commonStyles.bookingItem}>
              <Text>Building Name: {item.building_name}</Text>
              <Text>Building Address: {item.building_address}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ViewBuildingScreen;
