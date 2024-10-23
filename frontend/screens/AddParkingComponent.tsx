import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch, Keyboard, TouchableWithoutFeedback } from 'react-native';
import commonStyles from './commonStyles';

type AddParkingModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddParking: (parkingNumber: number | null, location: string, buildingId: number | null, isPermanentlyBlocked: boolean) => void;
};

const AddParkingModal: React.FC<AddParkingModalProps> = ({ visible, onClose, onAddParking }) => {
  const [parkingNumber, setParkingNumber] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [isPermanentlyBlocked, setIsPermanentlyBlocked] = useState(false);

  const handleAddParking = () => {
    onAddParking(parkingNumber, location, buildingId, isPermanentlyBlocked);
    setParkingNumber(null);
    setLocation('');
    setBuildingId(null);
    setIsPermanentlyBlocked(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.title}>Add Parking</Text>

            {/* Parking Number Input */}
            <Text style={commonStyles.label}>Parking Number</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter Parking Number"
              value={parkingNumber !== null ? parkingNumber.toString() : ''} // Show empty when null
              onChangeText={(text) => {
                if (text === '') {
                  setParkingNumber(null); // Set to null when cleared
                } else if (!isNaN(Number(text))) {
                  setParkingNumber(Number(text));
                }
              }}
              keyboardType="numeric"
            />

            {/* Location Input */}
            <Text style={commonStyles.label}>Location</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter Location"
              value={location}
              onChangeText={setLocation}
            />

            {/* Building ID Input */}
            <Text style={commonStyles.label}>Building ID:</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter Building ID"
              value={buildingId !== null ? buildingId.toString() : ''} // Show empty when null
              onChangeText={(text) => {
                if (text === '') {
                  setBuildingId(null); // Reset to null when cleared
                } else if (!isNaN(Number(text))) {
                  setBuildingId(Number(text));
                }
              }}
              keyboardType="numeric"
            />

            {/* Is Permanently Blocked Switch */}
            <View style={commonStyles.switchContainer}>
              <Text style={commonStyles.label}>Is Permanently Blocked?</Text>
              <Switch value={isPermanentlyBlocked} onValueChange={setIsPermanentlyBlocked} style={{ marginLeft: 'auto' }} />
            </View>

            {/* Buttons */}
            <TouchableOpacity style={commonStyles.button} onPress={handleAddParking}>
              <Text style={commonStyles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.button} onPress={onClose}>
              <Text style={commonStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddParkingModal;
