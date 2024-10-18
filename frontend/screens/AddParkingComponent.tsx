import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import commonStyles from './commonStyles';

type AddParkingModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddParking: (parkingNumber: number, location: string, buildingId: number, isPermanentlyBlocked: boolean) => void;
};

const AddParkingModal: React.FC<AddParkingModalProps> = ({ visible, onClose, onAddParking: onAddParking }) => {
  const [parkingNumber, setParkingNumber] = useState(-1);
  const [location, setLocation] = useState('');
  const [buildingId, setBuildingId] = useState(-1);
  const [isPermanentlyBlocked, setIsPermanentlyBlocked] = useState(false);

  const handleAddParking = () => {

    onAddParking(parkingNumber, location, buildingId, isPermanentlyBlocked);
    setParkingNumber(-1);
    setLocation('');
    setBuildingId(0);
    setIsPermanentlyBlocked(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={commonStyles.modalContainer}>
        <View style={commonStyles.modalContent}>
          <Text style={commonStyles.title}>Add Parking</Text>
          <Text style={commonStyles.label}>Parking Number</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter Parking Number"
            value={parkingNumber.toString()}
            onChangeText={(text) => setParkingNumber(Number(text))}
            keyboardType="numeric"
          />
          <Text style={commonStyles.label}>location</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter Location"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={commonStyles.label}>Building ID:</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter Building ID"
            value={buildingId.toString()}
            onChangeText={(text) => setBuildingId(Number(text))}
            keyboardType="numeric"
          />
          <View style={commonStyles.switchContainer}>
            <Text style={commonStyles.label}>Is Permanently Blocked?</Text>
            <Switch value={isPermanentlyBlocked} onValueChange={setIsPermanentlyBlocked} style={{ marginLeft: 'auto' }} />
          </View>
          <TouchableOpacity style={commonStyles.button} onPress={handleAddParking}>
            <Text style={commonStyles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={commonStyles.button} onPress={onClose}>
            <Text style={commonStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddParkingModal;
