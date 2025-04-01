import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Topbar({headerText}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const confirmLogout = () => {
    setModalVisible(true);
  };

  const logout = async() => {
    setModalVisible(false);
    await AsyncStorage.removeItem('username');
    navigation.navigate('Signin');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      {route.name !== 'ContactList' && (
        <TouchableOpacity onPress={goBack}>
          <Image
            style={styles.bannerImage}
            source={require('../assets/Images/back.png')}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.headerText}>{headerText}</Text>
      <View style={styles.flexGrowContainer} />
      <TouchableOpacity onPress={confirmLogout}>
        <Image
          style={styles.bannerImage}
          source={require('../assets/Images/logoutimg1.png')}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Logout</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to logout?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.logoutButton]}
                    onPress={logout}>
                    <Text style={styles.modalButtonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#127AFb',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
  flexGrowContainer: {
    flexGrow: 1,
  },
  headerText: {
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    fontSize: 18,
    left: 10,
  top: 3,
  },
  bannerImage: {
    width: 26,
    height: 26,
    tintColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#127AFb',
    fontFamily: 'Poppins-Regular',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#1277FB',
  },
  cancelButton: {
    backgroundColor: '#7e7e7e',
  },
  logoutButton: {
    backgroundColor: '#127AFb',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
});
