// screens/GuestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import commonStyles from './commonStyles';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Guest'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const URIEL_ACOSTA_COORDINATES = {
  latitude: 32.057692,
  longitude: 34.769607,
};

const GuestScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      console.log("Fetching location...");
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          maximumAge: 10000,
          timeout: 5000,
        });

        console.log("Location received:", location.coords);

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

      } catch (error) {
        console.error(error);
        Alert.alert('Failed to get location');
      }
    };

    fetchLocation();
  }, []);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  const handleContinue = async () => {
    if (!userLocation) {
      setLoading(true);
      return;
    }

    const distance = getDistance(userLocation.latitude, userLocation.longitude, URIEL_ACOSTA_COORDINATES.latitude, URIEL_ACOSTA_COORDINATES.longitude);

    console.log("Distance to Uriel Acosta Street:", distance, "meters");

    if (distance <= 300) { // 300 meters proximity check
      Alert.alert('You are within 300 meters of Uriel Acosta Street');
      navigation.navigate('GuestDirection');
    } else {
      Alert.alert('You are too far from Uriel Acosta Street');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userLocation && loading) {
      handleContinue();
    }
  }, [userLocation]);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access media library was denied');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Upload Your License Plate Photo</Text>

      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={removeImage} style={styles.deleteIcon}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.pickImageIcon}>
              <MaterialIcons name="photo-library" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <MaterialIcons name="photo-library" size={40} color="gray" />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[commonStyles.button, styles.continueButton]} onPress={handleContinue} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={commonStyles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default GuestScreen;

const styles = StyleSheet.create({
  iconButton: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  iconsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
  },
  deleteIcon: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
  },
  pickImageIcon: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
  },
  continueButton: {
    marginTop: 40, // Increased space between the image/icon and the button
  },
});
