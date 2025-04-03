import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler, // Import BackHandler
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {login} from '../redux/authslice';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SigninScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleNext = () => {
    let valid = true;
    const tempErrors = {};

    if (!username) {
      tempErrors.username = 'Please enter your username.';
      valid = false;
    }
    if (!password) {
      tempErrors.password = 'Please enter your valid password.';
      valid = false;
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});

    console.log(username, password,'___________________>')
    // Uncomment this when you have your login functionality ready
    dispatch(login({ username, password }))
      .unwrap()
      .then( async (response) => {
        if (response.status) {
    Toast.show({
      text1: 'Login Successful',
      type: 'success',
    });
    await AsyncStorage.setItem('username', response.username);
    navigation.navigate('ContactList');
        } else {
          Alert.alert('Login failed', 'Invalid username or password.');
        }
      })
      .catch(error => {
        console.log('Error: ' + error.message);
        Alert.alert('Error', 'An error occurred while logging in.');
      });
  };

  useEffect(() => {
    const handleBackButtonPress = () => {
      BackHandler.exitApp();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.Image}>
        <Image
          style={styles.bannerImage}
          source={require('../assets/Images/backgroundimg.png')}
        />
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.HeadingText}>Login</Text>
        <View style={styles.formContainer}>
          <Text style={styles.TopText}>Login To Your Account</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter email or username"
              placeholderTextColor="#C3C2C2"
              value={username}
              onChangeText={setUsername}
              color="#000"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#C3C2C2"
              secureTextEntry={!isPasswordVisible} 
              value={password}
              onChangeText={setPassword}
              color="#000"
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Image
                style={isPasswordVisible ? styles.hide : {}}
                source={
                  isPasswordVisible
                    ? require('../assets/Images/hide.png')
                    : require('../assets/Images/eye.png')
                }
              />
            </TouchableOpacity>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleNext}>
            <LinearGradient
              colors={['#1370FB', '#3F7EDB']}
              style={styles.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.btnText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  Image: {
    alignItems: 'center',
    zIndex: 1,
  },
  bannerImage: {
    height: 317,
    width: 417,
  },
  subContainer: {
    position: 'absolute',
    top: 125,
    left: 0,
    right: 0,
    zIndex: 2,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  HeadingText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 0.8,
  },
  TopText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    textAlign: 'center',
    color: '#444444',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 0.3,
    borderColor: '#A8A7A7',
    padding: 10,
    paddingRight: 40,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  icon: {
    tintColor: '#A8A7A7',
  },
  hide: {
    width: 23,
    height: 24,
    tintColor: '#A8A7A7',
  },
  btn: {
    borderRadius: 4,
    marginVertical: 30,
    alignItems: 'center',
  },
  gradient: {
    paddingVertical: 10,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
});
