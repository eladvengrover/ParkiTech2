import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import commonStyles from './commonStyles';

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddUser: (username: string, password: string, isManager: boolean) => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose, onAddUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isManager, setIsManager] = useState(false);

  const handleAddUser = () => {
    onAddUser(username, password, isManager);
    setUsername('');
    setPassword('');
    setIsManager(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={commonStyles.title}>Add User</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Is Manager?</Text>
            <Switch value={isManager} onValueChange={setIsManager} style={{ marginLeft: 'auto' }} />
          </View>
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default AddUserModal;
