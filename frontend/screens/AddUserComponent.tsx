import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import commonStyles from './commonStyles';

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddUser: (username: string, password: string, isManager: boolean, buildingId: number) => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose, onAddUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [buildingId, setBuildingId] = useState(-1);

  const handleAddUser = () => {
    // If the user is a manager, set the building ID to 0
    const finalBuildingId = isManager ? 0 : buildingId;

    onAddUser(username, password, isManager, finalBuildingId);
    setUsername('');
    setPassword('');
    setIsManager(false);
    setBuildingId(0);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={commonStyles.modalContainer}>
        <View style={commonStyles.modalContent}>
          <Text style={commonStyles.title}>Add User</Text>
          <Text style={commonStyles.label}>Username</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={commonStyles.label}>Password</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={commonStyles.switchContainer}>
            <Text style={commonStyles.label}>Is Manager?</Text>
            <Switch value={isManager} onValueChange={setIsManager} style={{ marginLeft: 'auto' }} />
          </View>
          <Text style={commonStyles.label}>Building ID:</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter Building ID"
            value={buildingId.toString()}
            onChangeText={(text) => setBuildingId(Number(text))}
            keyboardType="numeric"
            editable={!isManager}  // Disable input when the user is a manager
          />
          <TouchableOpacity style={commonStyles.button} onPress={handleAddUser}>
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

export default AddUserModal;
