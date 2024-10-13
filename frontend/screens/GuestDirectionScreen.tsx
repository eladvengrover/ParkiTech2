import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import commonStyles from './commonStyles';
import { RouteProp, useRoute } from '@react-navigation/native';

type GuestDirectionScreenRouteProp = RouteProp<{ params: { parkingId: number } }, 'params'>;

const GuestDirectionScreen: React.FC = () => {
  const route = useRoute<GuestDirectionScreenRouteProp>();
  const { parkingId } = route.params;

  const [parkingLocation, setParkingLocation] = useState<string | null>(null); // State to hold parking location
  const [parkingNumber, setParkingNumber] = useState<number | null>(null); // State to hold parking number
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading

  // Fetch parking location using the parking ID
  const fetchParkingLocation = async () => {
    try {
      const response = await fetch(`https://parkitect.azurewebsites.net/api/GetParkingDirections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parking_id: parkingId }), // Send parking_id in POST body
      });

      const data = await response.json();

      if (response.ok && data.location && data.number !== undefined) {
        console.log(response);
        setParkingLocation(data.location); // Assuming data contains the 'location' field
        setParkingNumber(data.number);     // Assuming data contains the 'number' field
      } else {
        throw new Error(data.error || 'Failed to fetch parking location or parking number');
      }
    } catch (error) {
      // Type-safe handling of unknown error type
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'An error occurred while fetching directions.');
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading when fetch completes
    }
  };

  // Trigger fetching of parking location on component mount
  useEffect(() => {
    fetchParkingLocation();
  }, [parkingId]);

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Directions to Parking</Text>
      <Text style={commonStyles.dateText}>
        Parking Number: {parkingNumber !== null ? parkingNumber : 'Not available'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loading spinner while fetching
      ) : parkingLocation ? (
        <Text style={commonStyles.dateText}>Location: {parkingLocation}</Text> // Display parking location
      ) : (
        <Text style={commonStyles.dateText}>Parking location not available.</Text> // Show if no location is found
      )}
    </View>
  );
};

export default GuestDirectionScreen;
