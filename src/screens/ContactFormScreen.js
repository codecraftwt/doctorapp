import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Topbar from '../component/Topbar';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {SkypeIndicator} from 'react-native-indicators';

import {create_user} from '../redux/userSlice';
import {
  fetchStates,
  fetchDistrictById,
  fetchTalukaById,
  fetchVillageById,
} from '../redux/locationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {baseurl} from '../utlis/API';
import {update_user} from '../redux/userSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

export default function ContactFormScreen({route}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedContact = route?.params?.selectedContact || {};
  const update = route?.params?.update || false;
  // calender
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null);
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    const formattedDate = currentDate.toISOString().slice(0, 10);

    // const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;

    if (selectedDateType === 'birthDate') {
      setBirthDate(formattedDate);
    } else if (selectedDateType === 'meetingDate') {
      setMeetingDate(formattedDate);
    }
  };
  //useSelectors
  const states = useSelector(
    state => state?.location?.states?.states_id_name || [],
  );
  const districts = useSelector(
    state => state?.location?.districts?.districts_id_name || [],
  );
  const talukas = useSelector(
    state => state?.location?.talukas.taluka_id_name || [],
  );
  const villages = useSelector(
    state => state?.location?.villages?.village_id_name || [],
  );

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

  //open dropdown
  const [openState, setOpenState] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openTaluka, setOpenTaluka] = useState(false);
  const [openVillage, setOpenVillage] = useState(false);
  const [openGender, setOpenGender] = useState(false);

  //get the data from form screen and others also

  //momo
  const selectedState = useMemo(() => {
    const state = states.find(s => s.state === selectedContact.state);
    return state ? state.id : null;
  }, [states, selectedContact.state]);

  const selectedDistrict = useMemo(() => {
    const district = districts.find(
      d => d.district === selectedContact.district,
    );
    return district ? district.id : null;
  }, [districts, selectedContact.district]);

  const selectedTaluka = useMemo(() => {
    const taluka = talukas.find(t => t.taluka === selectedContact.taluka);
    return taluka ? taluka.id : null;
  }, [talukas, selectedContact.taluka]);

  const selectedVillage = useMemo(() => {
    const village = villages.find(v => v.village === selectedContact.village);
    return village ? village.id : null;
  }, [villages, selectedContact.village]);

  // values and set values
  const [valueState, setValueState] = useState(
    selectedState !== undefined ? selectedState : null,
  );
  const [valueDistrict, setValueDistrict] = useState(
    selectedDistrict !== undefined ? selectedDistrict : null,
  );
  const [valueTaluka, setValueTaluka] = useState(
    selectedTaluka !== undefined ? selectedTaluka : null,
  );
  const [valueVillage, setValueVillage] = useState(
    selectedVillage !== undefined ? selectedVillage : null,
  );
  const [valueGender, setValueGender] = useState(selectedContact.gender);
  const [selectedImage, setSelectedImage] = useState(
    selectedContact.profile_pic
      ? `${baseurl}${selectedContact.profile_pic}`
      : null,
  );

  const [first_name, setFirstName] = useState(selectedContact.first_name || '');
  const [last_name, setLastName] = useState(selectedContact.last_name || '');
  const [phone, setPhoneNumber] = useState(selectedContact.phone || '');
  const [birthDate, setBirthDate] = useState(selectedContact.birth_date || '');
  const [meetingDate, setMeetingDate] = useState(
    selectedContact.date_of_meeting || '',
  );
  const [pincode, setPinCode] = useState(
    selectedContact?.pincode?.toString() || '',
  );
  const [errors, setErrors] = useState({});

  //numeric input validations
  const handlePhoneNumberChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
  };

  const handlePincodeNumberChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPinCode(numericValue);
  };

  // validations
  const validateForm = () => {
    let valid = true;
    let tempErrors = {};

    if (!first_name) {
      tempErrors.first_name = 'First Name is required';
      valid = false;
    }
    if (!last_name) {
      tempErrors.last_name = 'Last Name is required';
      valid = false;
    }
    if (!phone) {
      tempErrors.phone = 'Phone Number is required';
      valid = false;
    }
    if (!birthDate) {
      tempErrors.birthDate = 'Birth Date is required';
      valid = false;
    }
    if (!meetingDate) {
      tempErrors.meetingDate = 'Meeting Date is required';
      valid = false;
    }
    if (!valueState) {
      tempErrors.state = 'State is required';
      valid = false;
    }
    if (!valueDistrict) {
      tempErrors.district = 'District is required';
      valid = false;
    }
    if (!valueTaluka) {
      tempErrors.taluka = 'Taluka is required';
      valid = false;
    }
    if (!valueVillage) {
      tempErrors.village = 'Village is required';
      valid = false;
    }
    if (!pincode) {
      tempErrors.pincode = 'Pin Code is required';
      valid = false;
    }
    if (!valueGender) {
      tempErrors.gender = 'Gender is required';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const [loading, setLoading] = useState(false);
  const defaultImagePath = require('../assets/Images/profile.png');

  //post the data

  const handleAddContact = () => {
    const valid = validateForm();
    if (valid) {
      setLoading(true);
      const formData = new FormData();
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('phone', phone);
      formData.append('birth_date', birthDate);
      formData.append('date_of_meeting', meetingDate);
      formData.append('state', valueState);
      formData.append('district', valueDistrict);
      formData.append('taluka', valueTaluka);
      formData.append('village', valueVillage);
      formData.append('pincode', pincode);
      formData.append('gender', valueGender);
      if (selectedImage) {
        formData.append('profile_pic', {
          uri: selectedImage,
          type: 'image/jpg',
          name: 'profile.jpg',
        });
      } else {
        formData.append('profile_pic', {
          uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG-5Wi8qZXluHi11q-AHGh8riznXRoltGVYQ&s`,
          type: 'image/jpg',
          name: 'profile.jpg',
        });
      }
      dispatch(create_user(formData))
        .then(() => {
          setLoading(false);

          setFirstName('');
          setLastName('');
          setPhoneNumber('');
          setBirthDate('');
          setMeetingDate('');
          setValueState('');
          setValueDistrict('');
          setValueTaluka('');
          setValueVillage('');
          setPinCode('');
          setValueGender('');
          setSelectedImage(null);
          Toast.show({
            text1: 'Paitent Added Successfully',
            type: 'success',
          });
          navigation.navigate('ContactList');
        })
        .catch(error => {
          setLoading(false);
          console.error('Failed to add contact:', error);
        });

      console.log('submit');
    } else {
      console.log('Form is invalid', errors);
    }
  };

  //update the data

  const handleUpdateContact = () => {
    const valid = validateForm();
    if (valid) {
      setLoading(true);
      const formData = new FormData();
      formData.append('id', selectedContact.id);
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('phone', phone);
      formData.append('birth_date', birthDate);
      formData.append('date_of_meeting', meetingDate);
      formData.append('state', valueState);
      formData.append('district', valueDistrict);
      formData.append('taluka', valueTaluka);
      formData.append('village', valueVillage);
      formData.append('pincode', pincode);
      formData.append('gender', valueGender);

      if (selectedImage) {
        formData.append('profile_pic', {
          uri: selectedImage,
          type: 'image/jpg',
          name: 'update.jpg',
        });
      } else {
        formData.append('profile_pic', {
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG-5Wi8qZXluHi11q-AHGh8riznXRoltGVYQ&s',
          type: 'image/jpg',
          name: 'update.jpg',
        });
      }

      dispatch(update_user(formData))
        .unwrap()
        .then(() => {
          setLoading(false);
          Toast.show({
            text1: 'Patient Details Updated Successfully',
            type: 'success',
          });
          navigation.navigate('ContactList');
        })
        .catch(error => {
          setLoading(false);
          Alert.alert('Error', error.message || 'Failed to update contact');
        });
    }
  };

  //image function
  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setSelectedImage(image.path);
    });
  };

  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setSelectedImage(image.path);
    });
  };
  // remove profile

  const [isModalVisible, setIsModalVisible] = useState(false);

  const removePhoto = () => {
    setIsModalVisible(true);
  };

  //save Profile Pic

  const handleSave = () => {
    Toast.show({
      text1: 'Profile Image Saved Successfully',
      type: 'success',
    });
  };
  const confirmRemovePhoto = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
  };

  const cancelRemovePhoto = () => {
    setIsModalVisible(false);
  };

  //useeffets

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  // Set initial data if editing an existing contact
  useEffect(() => {
    if (selectedContact) {
      if (selectedContact.state_id) {
        setValueState(selectedContact.state_id);
      }
      if (selectedContact.district_id) {
        setValueDistrict(selectedContact.district_id);
      }
      if (selectedContact.taluka_id) {
        setValueTaluka(selectedContact.taluka_id);
      }
      if (selectedContact.village_id) {
        setValueVillage(selectedContact.village_id);
      }
    }
  }, [selectedContact]);

  // Fetch districts when the state changes or during edit initialization
  useEffect(() => {
    if (valueState) {
      dispatch(fetchDistrictById(valueState));
    }
  }, [valueState, dispatch]);

  // Fetch talukas when the district changes or during edit initialization
  useEffect(() => {
    if (valueDistrict) {
      dispatch(fetchTalukaById(valueDistrict));
    }
  }, [valueDistrict, dispatch]);

  // Fetch villages when the taluka changes or during edit initialization
  useEffect(() => {
    if (valueTaluka) {
      dispatch(fetchVillageById(valueTaluka));
    }
  }, [valueTaluka, dispatch]);

  //mapping
  const stateItems =
    states &&
    states?.map(state => ({
      label: state.state,
      value: state.id,
    }));

  const districtItems =
    districts &&
    districts?.map(district => ({
      label: district.district,
      value: district.id,
    }));

  const talukaItems =
    talukas &&
    talukas?.map(taluka => ({
      label: taluka.taluka,
      value: taluka.id,
    }));

  const villageItems =
    villages &&
    villages?.map(village => ({
      label: village.village,
      value: village.id,
    }));
  const genderItems = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Others', value: 'others'},
  ];

  //ui code

  return (
    <View style={styles.mainContainer}>
      <Topbar headerText={update ? 'Edit the Contact' : 'Add New Contact'} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.subContainer}>
          <Text style={styles.headText}>
            {update ? 'Edit Details' : 'Add Details'}
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#A8A7A7"
                value={first_name}
                onChangeText={text => {
                  setFirstName(text);
                  if (text && errors.first_name) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      first_name: '',
                    }));
                  }
                }}
                color="#000"
              />
              {errors.first_name && (
                <Text style={styles.errorText}>{errors.first_name}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#A8A7A7"
                value={last_name}
                onChangeText={text => {
                  setLastName(text);
                  if (text && errors.last_name) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      last_name: '',
                    }));
                  }
                }}
                color="#000"
              />
              {errors.last_name && (
                <Text style={styles.errorText}>{errors.last_name}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="+91 Phone Number"
                placeholderTextColor="#A8A7A7"
                value={phone}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setPhoneNumber(numericText);
                  if (errors.phone && numericText.trim() !== '') {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      phone: '',
                    }));
                  }
                }}
                maxLength={10}
                keyboardType="numeric"
              />
              {errors.phone && !phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Birth Date"
                placeholderTextColor="#A8A7A7"
                value={birthDate}
                editable={false}
              />
              {showDatePicker && selectedDateType === 'birthDate' && (
                <DateTimePicker
                  mode="date"
                  value={new Date(birthDate || Date.now())}
                  onChange={handleDateChange}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectedDateType('birthDate');
                  setShowDatePicker(!showDatePicker);
                }}>
                <Image
                  style={styles.calender}
                  source={require('../assets/Images/calender.png')}
                />
              </TouchableOpacity>
              {errors.birthDate && (
                <Text style={styles.errorText}>{errors.birthDate}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Date of Meeting"
                placeholderTextColor="#A8A7A7"
                value={meetingDate}
                editable={false}
              />
              {showDatePicker && selectedDateType === 'meetingDate' && (
                <DateTimePicker
                  mode="date"
                  value={new Date(meetingDate || Date.now())}
                  onChange={handleDateChange}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectedDateType('meetingDate');
                  setShowDatePicker(!showDatePicker);
                }}>
                <Image
                  style={styles.calender}
                  source={require('../assets/Images/calender.png')}
                />
              </TouchableOpacity>
              {errors.meetingDate && (
                <Text style={styles.errorText}>{errors.meetingDate}</Text>
              )}
            </View>

            <View style={styles.strikethroughContainer}>
              <View style={styles.strikethroughLeft} />
              <Text style={styles.label}>Address</Text>
              <View style={styles.strikethroughRight} />
            </View>
            <View style={styles.inputContainer}>
              <DropDownPicker
                listMode="MODAL"
                open={openState}
                value={valueState}
                items={stateItems}
                setOpen={setOpenState}
                setValue={value => {
                  setValueState(value);
                  if (errors.state && value) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      state: '',
                    }));
                  }
                }}
                placeholder={'State'}
                searchable={true}
                searchTextInputProps={{
                  placeholder: 'Search States',
                }}
                style={styles.pickerStyles}
                textStyle={{color: 'black'}}
                placeholderStyle={styles.placeholderStyle}
              />

              {errors.state && !valueState && (
                <Text style={styles.errorText}>{errors.state}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <DropDownPicker
                listMode="MODAL"
                open={openDistrict}
                value={valueDistrict}
                items={districtItems}
                setOpen={setOpenDistrict}
                setValue={value => {
                  setValueDistrict(value);
                  if (errors.district && value) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      district: '',
                    }));
                  }
                }}
                placeholder={'District'}
                searchable={true}
                searchTextInputProps={{
                  placeholder: 'Search Districts',
                }}
                style={styles.pickerStyles}
                placeholderStyle={styles.placeholderStyle}
              />
              {errors.district && !valueDistrict && (
                <Text style={styles.errorText}>{errors.district}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <DropDownPicker
                listMode="MODAL"
                open={openTaluka}
                value={valueTaluka}
                items={talukaItems}
                setOpen={setOpenTaluka}
                setValue={value => {
                  setValueTaluka(value);
                  if (errors.taluka && value) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      taluka: '',
                    }));
                  }
                }}
                placeholder={'Taluka'}
                searchable={true}
                searchTextInputProps={{
                  placeholder: 'Search Taluka',
                }}
                style={styles.pickerStyles}
                placeholderStyle={styles.placeholderStyle}
              />
              {errors.taluka && !valueTaluka && (
                <Text style={styles.errorText}>{errors.taluka}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <DropDownPicker
                listMode="MODAL"
                open={openVillage}
                value={valueVillage}
                items={villageItems}
                setOpen={setOpenVillage}
                setValue={value => {
                  setValueVillage(value);
                  if (errors.village && value) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      village: '',
                    }));
                  }
                }}
                placeholder={'Village'}
                searchable={true}
                searchTextInputProps={{placeholder: 'Search Village'}}
                style={styles.pickerStyles}
                placeholderStyle={styles.placeholderStyle}
              />
              {errors.village && !valueVillage && (
                <Text style={styles.errorText}>{errors.village}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="#A8A7A7"
                value={pincode}
                onChangeText={text => {
                  handlePincodeNumberChange(text);
                  if (errors.pincode && text.trim() !== '') {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      pincode: '',
                    }));
                  }
                }}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors.pincode && !pincode && (
                <Text style={styles.errorText}>{errors.pincode}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <DropDownPicker
                listMode="MODAL"
                open={openGender}
                value={valueGender}
                items={genderItems}
                setOpen={setOpenGender}
                setValue={value => {
                  setValueGender(value);
                  if (errors.gender && value) {
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      gender: '',
                    }));
                  }
                }}
                placeholder={'Gender'}
                searchable={true}
                style={styles.pickerStyles}
                placeholderStyle={styles.placeholderStyle}
              />
              {errors.gender && !valueGender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.profileImageContainer}>
                <View>
                  <Image
                    style={styles.profileImage}
                    source={
                      selectedImage
                        ? {uri: selectedImage}
                        : require('../assets/Images/profile.png')
                    }
                  />
                </View>
                <View style={styles.imageView}>
                  <View style={{marginLeft: 4}}>
                    <Text style={styles.captureText}>Capture Photo</Text>

                    <View style={styles.optionView}>
                      {selectedImage && (
                        <TouchableOpacity
                          style={styles.removebtn}
                          onPress={removePhoto}>
                          <Text style={styles.btnText}>Remove</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.savebtn}
                        onPress={handleSave}>
                        <Text style={styles.btnText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.cameraView}>
                    <TouchableOpacity onPress={takePhoto}>
                      <Image
                        style={styles.camera}
                        source={require('../assets/Images/camera.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectPhoto}>
                      <Image
                        style={styles.camera}
                        source={require('../assets/Images/gallary.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Modal Component */}
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={isModalVisible}
                  onRequestClose={cancelRemovePhoto}>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalText}>
                        Are you sure you want to remove the profile image?
                      </Text>
                      <View style={styles.modalButtons}>
                        <TouchableOpacity
                          style={[
                            styles.modalButton,
                            {backgroundColor: '#FF4B2B'},
                          ]}
                          onPress={confirmRemovePhoto}>
                          <Text style={styles.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={cancelRemovePhoto}>
                          <Text style={styles.modalButtonText}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <SkypeIndicator color="#127FFA" />
          </View>
        )}
        {update ? (
          <TouchableOpacity style={styles.addBtn} onPress={handleUpdateContact}>
            <LinearGradient
              colors={['#1370FB', '#3F7EDB']}
              style={styles.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.addbtnText}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={handleAddContact}>
            <LinearGradient
              colors={['#1370FB', '#3F7EDB']}
              style={styles.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.addbtnText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  subContainer: {
    margin: 20,
    borderWidth: 0.2,
    borderColor: '#B4B4B4',
  },
  headText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    color: '#444444',
    textAlign: 'center',
    marginTop: 30,
  },
  formContainer: {
    marginTop: 30,
    marginHorizontal: 14,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    borderRadius: 4,
    borderWidth: 0.6,
    borderColor: '#D7D7D7',
    padding: 9,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingRight: 40,
    color: '#000',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#A8A7A7',
    backgroundColor: '#F5F7FB',
    zIndex: 1,
    paddingHorizontal: 1,
  },
  calender: {
    width: 23,
    height: 25,
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 10,
  },
  pickerStyles: {
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 0.6,
    borderColor: '#D7D7D7',
    borderRadius: 4,
  },
  placeholderStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#A8A7A7',
  },
  profileImageContainer: {
    borderRadius: 4,
    borderWidth: 0.6,
    borderColor: '#D7D7D7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  camera: {
    width: 23,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginTop: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderColor: '#D7D7D7',
    alignSelf: 'center',
    margin: 8,
  },
  optionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  captureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#A8A7A7',
  },
  imageView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  cameraView: {
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  btnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#ffffff',
  },
  removebtn: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    backgroundColor: '#A0A0A0',
    borderRadius: 3,
  },
  savebtn: {
    paddingVertical: 2,
    paddingHorizontal: 9,
    backgroundColor: '#1277FB',
    borderRadius: 3,
  },
  addBtnbtn: {
    borderRadius: 4,
    marginVertical: 30,
    alignItems: 'center',
  },
  gradient: {
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  addbtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  strikethroughContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  strikethroughLeft: {
    flex: 0.07,
    height: 1,
    backgroundColor: '#000000',
  },
  strikethroughRight: {
    flex: 0.93,
    height: 1,
    backgroundColor: '#000000',
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
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#000',
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

  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
});
