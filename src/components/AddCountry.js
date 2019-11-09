import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {SvgUri} from 'react-native-svg';

const VIEWPORT_WIDTH = Dimensions.get('window').width;
const VIEWPORT_HEIGHT = Dimensions.get('window').height;

const SearchSection = ({selectedCountries}) => {
  return (
    <View style={styles.selectedCountriesContainer}>
      {selectedCountries.map(selectedCountry => (
        <View key={selectedCountry} style={styles.selectedCountry}>
          <Text>{selectedCountry}</Text>
        </View>
      ))}
    </View>
  );
};
const Country = ({name, flag, isSelected, onPressCountry}) => {
  const onPress = () => onPressCountry(name);
  const selectedColor = isSelected ? 'purple' : 'white';
  return (
    <TouchableOpacity onPress={onPress} style={styles.countryItemContainer}>
      <View style={styles.flag}>
        <SvgUri width="40" height="30" uri={flag} />
      </View>
      <View style={styles.countryNameContainer}>
        <Text>{name}</Text>
      </View>
      <View style={[styles.checked, {backgroundColor: selectedColor}]} />
    </TouchableOpacity>
  );
};

const _keyExtractor = ({alpha3code}) => alpha3code;

const isCountrySelected = (selectedCountries, country) =>
  selectedCountries.map(name => name).indexOf(country);

function AddCountry() {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState(['Afghanistan']);

  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then(response => response.json())
      .then(response => setCountries(response))
      .catch(error => console.log(error));
  }, []);

  const onPressCountry = selectedCountry => {
    if (isCountrySelected(selectedCountries, selectedCountry) >= 0) {
      setSelectedCountries(
        selectedCountries.filter(name => name !== selectedCountry),
      );
    } else {
      const tmpCountries = selectedCountries;
      tmpCountries.push(selectedCountry);
      setSelectedCountries([...tmpCountries]);
    }
  };

  const _renderItem = ({item}) => (
    <Country
      {...item}
      isSelected={isCountrySelected(selectedCountries, item.name) >= 0}
      onPressCountry={onPressCountry}
    />
  );
  return (
    <View>
      <SearchSection selectedCountries={selectedCountries} />
      <FlatList
        data={countries}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  countryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: VIEWPORT_WIDTH,
    paddingVertical: 10,
    backgroundColor: 'pink',
  },
  countryNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  flag: {
    height: 30,
    width: 40,
    marginHorizontal: 15,
  },
  countryName: {
    fontWeight: 'bold',
  },
  selectedCountriesContainer: {
    flexDirection: 'row',
    width: VIEWPORT_WIDTH,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  selectedCountry: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: 'violet',
  },
  selectedCountryText: {
    color: 'white',
    fontWeight: '400',
  },
  checked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
});

export default AddCountry;
