import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('username');
      console.log('===========',isLoggedIn)
      if (isLoggedIn?.length > 0) {
        navigation.replace('ContactList');
      } else {
        navigation.replace('Signin');
      }
    };

    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 2000);  

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#1392FA', '#127AFB']}
      style={styles.mainContainer}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={styles.banner}>
        <Image
          style={styles.bannerImage}
          source={require('../assets/Images/banner.png')}
        />
        <Text style={styles.headText}>Take Care Your Health</Text>
        {/* <Text style={styles.subText}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy
        </Text> */}
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    height: 350,
    width: 219,
  },
  headText: {
    color: '#ffffff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
    textAlign: 'center',
  },
  subText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    padding: 10,
    marginHorizontal: 20,
  },
});
