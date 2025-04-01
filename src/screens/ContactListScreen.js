import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity ,
  View,
  Modal,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Topbar from '../component/Topbar';
import ContactCard from '../component/ContactCard';
import Searchbar from '../component/Searchbar';
import {get_user} from '../redux/userSlice';
import {useFocusEffect} from '@react-navigation/native';
import {SkypeIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactListScreen({navigation}) {
  const dispatch = useDispatch();
  const {user, isLoading, error} = useSelector(state => state.user);
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    state: null,
    district: null,
    taluka: null,
    village: null,
    meetingDate: null,
    birthDate: null,
  });
  useFocusEffect(
    useCallback(() => {
      dispatch(get_user());
      const onBackPress = () => {
        setModalVisible(true);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [dispatch]),
  );

  useEffect(() => {
    if (Array.isArray(user)) {
      const sortedData = user.filter(
        contact =>
          (contact.first_name
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
            contact.last_name
              .toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            contact.village.toLowerCase().includes(searchInput.toLowerCase()) ||
            contact.taluka.toLowerCase().includes(searchInput.toLowerCase()) ||
            contact.district
              .toLowerCase()
              .includes(searchInput.toLowerCase())) &&
          (!filters.state || contact.state_id === filters.state) &&
          (!filters.district || contact.district_id === filters.district) &&
          (!filters.taluka || contact.taluka_id === filters.taluka) &&
          (!filters.village || contact.village_id === filters.village) &&
          (!filters.meetingDate ||
            new Date(contact.date_of_meeting).toISOString().split('T')[0] ===
              new Date(filters.meetingDate).toISOString().split('T')[0]) &&
          (!filters.birthDate ||
            new Date(contact.birth_date).toISOString().split('T')[0] ===
              new Date(filters.birthDate).toISOString().split('T')[0]),
      );
      setFilteredData(sortedData.reverse());
    }
  }, [searchInput, user, filters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(get_user()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FormView', {selectedContact: item})}>
      <ContactCard item={item} />
    </TouchableOpacity>
  );

  const handleAdd = () => {
    navigation.navigate('ContactForm');
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    navigation.navigate('Signin');
  };

  const handleRemoveFilter = () => {
    setFilters({
      state: null,
      district: null,
      taluka: null,
      village: null,
      meetingDate: null,
      birthDate: null,
    });
    setSearchInput('');
  };

  return (
    <View style={styles.container}>
      <Topbar headerText="Contacts List" />
      <Searchbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        setFilters={setFilters}
      />
      <View style={styles.subContainer}>
        <Text style={styles.text}>Visited Patients</Text>
        <TouchableOpacity style={styles.addbtn} onPress={handleAdd}>
          <Text style={styles.btnText}>Add Patient</Text>
        </TouchableOpacity>
      </View>

      {Object.values(filters).some(filter => filter !== null) && (
        <View style={styles.remove}>
          <TouchableOpacity
            style={styles.removeFilterContainer}
            onPress={handleRemoveFilter}>
            <Text style={styles.removeFilterText}>Remove Filter</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <SkypeIndicator color="#127FFA" />
        </View>
      ) : error ? (
        <Text>{error}</Text>
      ) : filteredData.length === 0 ? (
        // Show the "No data available" message if no filtered data
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatlistContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleModalClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Exit</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to exit?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleModalClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.exitButton]}
                onPress={handleLogout}>
                <Text style={styles.buttonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  flatlistContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#0C2730',
  },
  addbtn: {
    backgroundColor: '#127FFA',
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  btnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
  },
  loadingContainer: {
    paddingTop: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
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
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#7e7e7e',
  },
  exitButton: {
    backgroundColor: '#127AFb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  remove: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  removeFilterContainer: {
    backgroundColor: '#FF4B2B',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 19,
  },
  removeFilterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
});
