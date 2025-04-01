import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {baseurl} from '../utlis/API';

export default function ContactCard({item}) {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const viewDetails = () => {
    navigation.navigate('FormView', {
      selectedContact: item,
    });
  };

  const zoomImage = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.imageContainer} onPress={zoomImage}>
        <Image
          style={styles.profileImage}
          source={{uri: `${baseurl}${item.profile_pic}`}}
        />
      </TouchableOpacity>
      <View style={styles.subContainer}>
        <Text style={styles.userName}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.date}>{item.date_of_meeting}</Text>
        <Text style={styles.address}>
          {item.village}, {item.taluka}, {item.district}, {item.state}
        </Text>
        <TouchableOpacity style={styles.btn} onPress={viewDetails}>
          <LinearGradient
            colors={['#1394FA', '#1277FB']}
            style={styles.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={styles.btnText}>View Details</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

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
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}>
            <Image
              style={styles.modalImage}
              source={{uri: `${baseurl}${item.profile_pic}`}}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  imageContainer: {
    marginRight: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#434343',
    marginBottom: 3,
  },
  date: {
    fontFamily: 'Poppins-Medium',
    color: '#9C9C9C',
    fontSize: 12,
  },
  address: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#000',
    marginBottom: 10,
  },
  btn: {
    alignSelf: 'flex-start',
  },
  gradient: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  btnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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
    height: 280,
    resizeMode: 'cover',
    borderRadius: 10,
    // marginBottom: 15,
  },
  closeButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
