import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Filter from './Filter';

export default function Searchbar({
  searchInput,
  setSearchInput,
  filters,
  setFilters,
}) {
  const clearSearchInput = () => {
    setSearchInput('');
  };

  return (
    <View style={styles.main}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Patient Details"
          placeholderTextColor="#C1C1C1"
          value={searchInput}
          onChangeText={setSearchInput}
          accessibilityLabel="Search input"
          accessibilityHint="Type here to search patient details"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity
            style={styles.cancelContainer}
            onPress={clearSearchInput}
            accessibilityLabel="Clear search input"
            accessibilityHint="Clears the search input field">
            <Image
              style={styles.cancel}
              source={require('../assets/Images/cancle.png')}
              accessibilityRole="image"
              accessibilityLabel="Clear input icon"
            />
          </TouchableOpacity>
        )}
      </View>
      <Filter filters={filters} setFilters={setFilters} />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    width: '86%',
    position: 'relative',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 0.7,
    borderColor: '#DADADA',
    padding: 10,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    paddingRight: 40,
    color: '#000',
  },
  cancelContainer: {
    position: 'absolute',
    right: 12,
    top: '40%',
    transform: [{translateY: -10}],
  },
  cancel: {
    height: 17,
    width: 17,
    tintColor: '#C1C1C1',
  },
  filterContainer: {
    marginLeft: 10,
  },
  filter: {
    height: 45,
    width: 45,
    tintColor: '#C1C1C1',
  },
});
