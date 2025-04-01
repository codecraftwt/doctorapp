import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchStates,
  fetchDistrictById,
  fetchTalukaById,
  fetchVillageById,
} from '../redux/locationSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Filter({setFilters, filters}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [isMeetingDateSelected, setIsMeetingDateSelected] = useState(false);
  const [isBirthDateSelected, setIsBirthDateSelected] = useState(false);

  const dispatch = useDispatch();
  const states = useSelector(
    state => state?.location?.states?.states_id_name || [],
  );
  const districts = useSelector(
    state => state?.location?.districts?.districts_id_name || [],
  );
  const talukas = useSelector(
    state => state?.location?.talukas?.taluka_id_name || [],
  );
  const villages = useSelector(
    state => state?.location?.villages?.village_id_name || [],
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);
  const [isTalukaSelected, setIsTalukaSelected] = useState(false);
  const [isVillageSelected, setIsVillageSelected] = useState(false);

  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [openDistrictDropdown, setOpenDistrictDropdown] = useState(false);
  const [openTalukaDropdown, setOpenTalukaDropdown] = useState(false);
  const [openVillageDropdown, setOpenVillageDropdown] = useState(false);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (selectedState) {
      dispatch(fetchDistrictById(selectedState));
    } else {
      setSelectedDistrict(null);
      setIsDistrictSelected(false);
      setOpenDistrictDropdown(false);
      setOpenTalukaDropdown(false);
      setOpenVillageDropdown(false);
    }
  }, [selectedState, dispatch]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchTalukaById(selectedDistrict));
    } else {
      setSelectedTaluka(null);
      setIsTalukaSelected(false);
      setOpenTalukaDropdown(false);
      setOpenVillageDropdown(false);
    }
  }, [selectedDistrict, dispatch]);

  useEffect(() => {
    if (selectedTaluka) {
      dispatch(fetchVillageById(selectedTaluka));
    } else {
      setSelectedVillage(null);
      setIsVillageSelected(false);
      setOpenVillageDropdown(false);
    }
  }, [selectedTaluka, dispatch]);

  useEffect(() => {
    setIsStateSelected(selectedState !== null);
  }, [selectedState]);

  useEffect(() => {
    setIsDistrictSelected(selectedDistrict !== null);
  }, [selectedDistrict]);

  useEffect(() => {
    setIsTalukaSelected(selectedTaluka !== null);
  }, [selectedTaluka]);

  useEffect(() => {
    setIsVillageSelected(selectedVillage !== null);
  }, [selectedVillage]);

  useEffect(() => {
    if (filters) {
      setSelectedState(filters.state || null);
      setSelectedDistrict(filters.district || null);
      setSelectedTaluka(filters.taluka || null);
      setSelectedVillage(filters.village || null);
      setMeetingDate(filters.meetingDate || '');
      setBirthDate(filters.birthDate || '');
      setIsMeetingDateSelected(!!filters.meetingDate);
      setIsBirthDateSelected(!!filters.birthDate);
    }
  }, [filters]);

  const stateItems = states.map(state => ({
    label: state.state,
    value: state.id,
  }));

  const districtItems = districts.map(district => ({
    label: district.district,
    value: district.id,
  }));

  const talukaItems = talukas.map(taluka => ({
    label: taluka.taluka,
    value: taluka.id,
  }));

  const villageItems = villages.map(village => ({
    label: village.village,
    value: village.id,
  }));

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the picker after selection

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date properly

      if (selectedDateType === 'meetingDate') {
        setMeetingDate(formattedDate);
        setIsMeetingDateSelected(true);
      } else if (selectedDateType === 'birthDate') {
        setBirthDate(formattedDate);
        setIsBirthDateSelected(true);
      }
    }
  };
  const handleStateCheckboxChange = () => {
    if (isStateSelected) {
      setSelectedState(null);
      setIsStateSelected(false);
      setOpenStateDropdown(false);
      setOpenDistrictDropdown(false);
      setOpenTalukaDropdown(false);
      setOpenVillageDropdown(false);
    } else {
      setIsStateSelected(true);
      setOpenStateDropdown(true);
    }
  };

  const handleDistrictCheckboxChange = () => {
    if (isDistrictSelected) {
      setSelectedDistrict(null);
      setIsDistrictSelected(false);
      setOpenDistrictDropdown(false);
      setOpenTalukaDropdown(false);
      setOpenVillageDropdown(false);
    } else {
      setIsDistrictSelected(true);
      setOpenDistrictDropdown(true);
    }
  };

  const handleTalukaCheckboxChange = () => {
    if (isTalukaSelected) {
      setSelectedTaluka(null);
      setIsTalukaSelected(false);
      setOpenTalukaDropdown(false);
      setOpenVillageDropdown(false);
    } else {
      setIsTalukaSelected(true);
      setOpenTalukaDropdown(true);
    }
  };

  const handleVillageCheckboxChange = () => {
    if (isVillageSelected) {
      setSelectedVillage(null);
      setIsVillageSelected(false);
      setOpenVillageDropdown(false);
    } else {
      setIsVillageSelected(true);
      setOpenVillageDropdown(true);
    }
  };

  const handleMeetingDateCheckboxChange = () => {
    if (isMeetingDateSelected) {
      setMeetingDate('');
      setIsMeetingDateSelected(false);
    } else {
      setSelectedDateType('meetingDate');
      setShowDatePicker(true);
    }
  };
  const handleBirthDateCheckboxChange = () => {
    if (isBirthDateSelected) {
      setBirthDate('');
      setIsBirthDateSelected(false);
    } else {
      setSelectedDateType('birthDate');
      setShowDatePicker(true);
    }
  };

  const handleApplyFilters = () => {
    const newFilters = {
      state: selectedState,
      district: selectedDistrict,
      taluka: selectedTaluka,
      village: selectedVillage,
      meetingDate: isMeetingDateSelected ? meetingDate : null, // Ensure selected value is saved
      birthDate: isBirthDateSelected ? birthDate : null,
    };

    console.log('Applying Filters:', newFilters); // Debugging log

    setFilters(prevFilters => ({
      ...prevFilters, // Preserve other filter values if needed
      ...newFilters, // Merge updated filters
    }));

    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOverlayPress = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.filterContainer}
        onPress={() => setModalVisible(true)}>
        <Image
          style={[
            styles.filter,
            {
              tintColor:
                isStateSelected ||
                isDistrictSelected ||
                isTalukaSelected ||
                isVillageSelected
                  ? '#000000'
                  : '#FFFFFF',
            },
          ]}
          source={require('../assets/Images/filter.png')}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* State Selection */}
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    style={styles.CheckBox}
                    value={isStateSelected}
                    onValueChange={handleStateCheckboxChange}
                    tintColors={{true: '#2196F3', false: '#D9D9D9'}}
                  />
                  <Text style={styles.label}>State</Text>
                </View>

                {openStateDropdown && (
                  <View style={styles.inputContainer}>
                    <DropDownPicker
                      listMode="MODAL"
                      open={openStateDropdown}
                      value={selectedState}
                      items={stateItems}
                      setOpen={setOpenStateDropdown}
                      setValue={setSelectedState}
                      placeholder="Select State"
                      searchable={true}
                      searchTextInputProps={{placeholder: 'Search States'}}
                      style={styles.pickerStyles}
                      textStyle={{color: 'black'}}
                      placeholderStyle={styles.placeholderStyle}
                    />
                  </View>
                )}
                {selectedState && (
                  <Text style={styles.selectedValue}>
                    {
                      stateItems.find(item => item.value === selectedState)
                        ?.label
                    }
                  </Text>
                )}

                {/* District Selection */}
                {isStateSelected && (
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      style={styles.CheckBox}
                      value={isDistrictSelected}
                      onValueChange={handleDistrictCheckboxChange}
                      tintColors={{true: '#2196F3', false: '#D9D9D9'}}
                      disabled={!isStateSelected}
                    />
                    <Text style={styles.label}>District</Text>
                  </View>
                )}

                {isStateSelected &&
                  openDistrictDropdown &&
                  isDistrictSelected && (
                    <View style={styles.inputContainer}>
                      <DropDownPicker
                        listMode="MODAL"
                        open={openDistrictDropdown}
                        value={selectedDistrict}
                        items={districtItems}
                        setOpen={setOpenDistrictDropdown}
                        setValue={setSelectedDistrict}
                        placeholder="Select District"
                        searchable={true}
                        searchTextInputProps={{placeholder: 'Search Districts'}}
                        style={styles.pickerStyles}
                        textStyle={{color: 'black'}}
                        placeholderStyle={styles.placeholderStyle}
                      />
                    </View>
                  )}
                {selectedDistrict && (
                  <Text style={styles.selectedValue}>
                    {
                      districtItems.find(
                        item => item.value === selectedDistrict,
                      )?.label
                    }
                  </Text>
                )}

                {/* Taluka Selection */}
                {isDistrictSelected && (
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      style={styles.CheckBox}
                      value={isTalukaSelected}
                      onValueChange={handleTalukaCheckboxChange}
                      tintColors={{true: '#2196F3', false: '#D9D9D9'}}
                      disabled={!isDistrictSelected}
                    />
                    <Text style={styles.label}>Taluka</Text>
                  </View>
                )}

                {isDistrictSelected &&
                  openTalukaDropdown &&
                  isTalukaSelected && (
                    <View style={styles.inputContainer}>
                      <DropDownPicker
                        listMode="MODAL"
                        open={openTalukaDropdown}
                        value={selectedTaluka}
                        items={talukaItems}
                        setOpen={setOpenTalukaDropdown}
                        setValue={setSelectedTaluka}
                        placeholder="Select Taluka"
                        searchable={true}
                        searchTextInputProps={{placeholder: 'Search Talukas'}}
                        style={styles.pickerStyles}
                        textStyle={{color: 'black'}}
                        placeholderStyle={styles.placeholderStyle}
                      />
                    </View>
                  )}
                {selectedTaluka && (
                  <Text style={styles.selectedValue}>
                    {
                      talukaItems.find(item => item.value === selectedTaluka)
                        ?.label
                    }
                  </Text>
                )}

                {/* Village Selection */}
                {isTalukaSelected && (
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      style={styles.CheckBox}
                      value={isVillageSelected}
                      onValueChange={handleVillageCheckboxChange}
                      tintColors={{true: '#2196F3', false: '#D9D9D9'}}
                      disabled={!isTalukaSelected}
                    />
                    <Text style={styles.label}>Village</Text>
                  </View>
                )}

                {isTalukaSelected &&
                  openVillageDropdown &&
                  isVillageSelected && (
                    <View style={styles.inputContainer}>
                      <DropDownPicker
                        listMode="MODAL"
                        open={openVillageDropdown}
                        value={selectedVillage}
                        items={villageItems}
                        setOpen={setOpenVillageDropdown}
                        setValue={setSelectedVillage}
                        placeholder="Select Village"
                        searchable={true}
                        searchTextInputProps={{placeholder: 'Search Villages'}}
                        style={styles.pickerStyles}
                        textStyle={{color: 'black'}}
                        placeholderStyle={styles.placeholderStyle}
                      />
                    </View>
                  )}
                {selectedVillage && (
                  <Text style={styles.selectedValue}>
                    {
                      villageItems.find(item => item.value === selectedVillage)
                        ?.label
                    }
                  </Text>
                )}

                {/* Meeting Date Selection */}
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    style={styles.CheckBox}
                    value={isMeetingDateSelected}
                    onValueChange={handleMeetingDateCheckboxChange}
                    tintColors={{true: '#2196F3', false: '#D9D9D9'}}
                  />
                  <Text style={styles.label}>Meeting Date</Text>
                </View>
                {isMeetingDateSelected && (
                  <Text style={styles.selectedValue}>{meetingDate}</Text>
                )}
                {showDatePicker && selectedDateType === 'meetingDate' && (
                  <DateTimePicker
                    value={meetingDate ? new Date(meetingDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    style={styles.CheckBox}
                    value={isBirthDateSelected}
                    onValueChange={handleBirthDateCheckboxChange}
                    tintColors={{true: '#2196F3', false: '#D9D9D9'}}
                  />
                  <Text style={styles.label}>Birth Date</Text>
                </View>
                {isBirthDateSelected && (
                  <Text style={styles.selectedValue}>{birthDate}</Text>
                )}
                {showDatePicker && selectedDateType === 'birthDate' && (
                  <DateTimePicker
                    value={birthDate ? new Date(birthDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleApplyFilters}>
                  <Text style={styles.closeButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  filterContainer: {
    padding: 8,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#127FFA',
    borderRadius: 9,
  },
  filter: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#F5F7FB',
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  CheckBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
  },
  inputContainer: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  pickerStyles: {
    borderColor: '#DDDDDD',
    backgroundColor: '#FAFAFA',
  },
  placeholderStyle: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  selectedValue: {
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF4B2B',
    padding: 12,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  datePickerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  CheckBox: {
    marginRight: 10,
    width: 25,
    height: 25,
    borderRadius: 3,
  },
  label: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  calendarImageWrapper: {
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calender: {
    width: 30,
    height: 30,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});
