import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Topbar from '../component/Topbar';
import LinearGradient from 'react-native-linear-gradient';
import {baseurl} from '../utlis/API';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {delete_user} from '../redux/userSlice';
import {useDispatch} from 'react-redux';

export default function FormView({route}) {
  const selectedContact = route?.params?.selectedContact;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

  const edit = () => {
    navigation.navigate('ContactForm', {selectedContact, update: true});
  };

  const zoomImage = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const confirmDelete = () => {
    setDeleteModalVisible(true);
  };

  const deleteContact = () => {
    if (!selectedContact?.id) {
      console.error('No ID found for the contact.');
      return;
    }

    console.log('Deleting user with ID:', selectedContact.id);

    dispatch(delete_user(selectedContact.id))
      .then(action => {
        setDeleteModalVisible(false);
        Toast.show({
          text1: 'Patient Record is Deleted',
          type: 'success',
        });
        navigation.navigate('ContactList');
      })
      .catch(error => {
        console.error('Failed to Delete Patient Record', error);
        Toast.show({
          text1: 'Failed to delete patient',
          type: 'error',
        });
      });
  };

  return (
    <View style={styles.mainContainer}>
      <Topbar headerText="Patient Details" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.subContainer}>
          <View style={styles.inputss}>
            <>
              <TouchableOpacity onPress={zoomImage}>
                <Image
                  style={styles.profileImage}
                  source={{uri: `${baseurl}${selectedContact?.profile_pic}`}}
                />
              </TouchableOpacity>
            </>
            <View style={styles.btncontainer}>
              <TouchableOpacity
                style={[styles.btn, {backgroundColor: '#FFC700'}]}
                onPress={edit}>
                <Image
                  style={styles.icon}
                  source={require('../assets/Images/edit.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, {backgroundColor: '#FF4B2B'}]}
                onPress={confirmDelete}>
                <Image
                  style={styles.icon}
                  source={require('../assets/Images/delete.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.value}>
              {' '}
              {selectedContact.first_name || 'N/A'}
            </Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.value}>
              {' '}
              {selectedContact.last_name || 'N/A'}{' '}
            </Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{selectedContact.phone || 'N/A'}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Birth Date:</Text>
            <Text style={styles.value}>
              {selectedContact.birth_date || 'N/A'}
            </Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Meeting Date:</Text>
            <Text style={styles.value}>
              {selectedContact.date_of_meeting || 'N/A'}
            </Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{selectedContact.state || 'N/A'}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.value}>
              {selectedContact.district || 'N/A'}
            </Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Taluka:</Text>
            <Text style={styles.value}>{selectedContact.taluka || 'N/A'}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Village:</Text>
            <Text style={styles.value}>{selectedContact.village || 'N/A'}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Pincode:</Text>
            <Text style={styles.value}>{selectedContact.pincode || 'N/A'}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{selectedContact.gender || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay1}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText1}>
              Are you sure you want to delete this contact?
            </Text>
            <View style={styles.modalbtn}>
              <TouchableOpacity style={styles.btn} onPress={deleteContact}>
                <LinearGradient
                  colors={['#FF4B2B', '#FF4B2B']}
                  style={styles.gradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.btnText}>Yes, Delete</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setDeleteModalVisible(false)}>
                <LinearGradient
                  colors={['#1394FA', '#1277FB']}
                  style={styles.gradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.btnText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={closeModal}
          activeOpacity={1}>
          <TouchableOpacity
            style={styles.modalContent1}
            activeOpacity={1}
            onPress={() => {}}>
            <Image
              style={styles.modalImage}
              source={{uri: `${baseurl}${selectedContact?.profile_pic}`}}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
  },
  subContainer: {
    margin: 20,
    borderWidth: 0.2,
    borderColor: '#B4B4B4',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  inputs: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D7D7D7',
  },
  inputss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D7D7D7',
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#444444',
    width: '57%',
  },
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    width: '43%',
  },
  btncontainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 12,
    marginHorizontal: 30,
    backgroundColor: '#1277FB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButtonText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
  modalOverlay1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent1: {
    width: '65%',
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  modalText1: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  modalbtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  btn: {
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 5,
    marginHorizontal: 7,
    bottom: 15,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  icon: {
    width: 20,
    height: 20,
    margin: 7,
    tintColor: '#fff',
  },
  btnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
  },
});
