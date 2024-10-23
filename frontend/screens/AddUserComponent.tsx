import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch, Keyboard, TouchableWithoutFeedback } from 'react-native';
import commonStyles from './commonStyles';

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddUser: (username: string, password: string, email: string, isManager: boolean, buildingId: number) => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose, onAddUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [buildingId, setBuildingId] = useState<number | null>(null); // Change -1 to null for no value

  const handleAddUser = () => {
    const finalBuildingId = isManager ? 0 : (buildingId || -1); // Ensure buildingId is correct
    onAddUser(username, password, email, isManager, finalBuildingId);
    setUsername('');
    setPassword('');
    setEmail('');
    setIsManager(false);
    setBuildingId(null); // Reset to null
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text style={commonStyles.label}>Email</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
            />
            <View style={commonStyles.switchContainer}>
              <Text style={commonStyles.label}>Is Manager?</Text>
              <Switch value={isManager} onValueChange={setIsManager} style={{ marginLeft: 'auto' }} />
            </View>
            <Text style={commonStyles.label}>Building ID:</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter Building ID"
              value={buildingId !== null ? buildingId.toString() : ''} // Handle empty case
              onChangeText={(text) => {
                if (text === '') {
                  setBuildingId(null); // Set to null when cleared
                } else if (!isNaN(Number(text))) {
                  setBuildingId(Number(text));
                }
              }}
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
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddUserModal;
