import {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Pressable,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
const Login = ({navigation}) => {
  async function clearStorage() {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }
  const [username, setUsername] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  function emailValidator(email) {
    const re = /\S+@\S+\.\S+/;
    if (!email) return "Email can't be empty.";
    if (!re.test(email)) return 'email in invalid.';
    return '';
  }
  function passwordValidator(password) {
    if (!password) return "Password can't be empty.";
    if (password.length < 5)
      return 'Password must be at least 5 characters long.';
    return '';
  }
  function onLoginPressed() {
    loginbtn();
    return;
  }
  const loginbtn = async () => {
    try {
      // setLoading(true);
      const response = await fetch('http://192.168.1.2:8000/api/token/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          //   Authorization: 'Token 5c2561b056ea18fac942b62d7d239ba30d6bfc17',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
      const json = await response.json();
      if (response.status !== 200) {
        console.error(json);
        return;
      }
      await EncryptedStorage.setItem('user_token', json.token);
      navigation.replace('Main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <Text style={styles.title}>صفحه ی ورود:</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.textbox}
          placeholder="Username"
          placeholderTextColor="black"
          label="Username"
          returnKeyType="next"
          value={username.value}
          onChangeText={text => setUsername({value: text, error: ''})}
          error={!!username.error}
          errorText={username.error}
          autoCapitalize="none"
          autoCompleteType="username"
          textContentType="username"
          keyboardType="username"
        />
        <TextInput
          style={styles.textbox}
          placeholder="Password"
          placeholderTextColor="black"
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({value: text, error: ''})}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
      </View>

      <View style={styles.row}>
        <Button onPress={() => onLoginPressed()} title="ورود" color={'green'} />
        <Button onPress={() => navigation.push('Register')} title="ثبت نام" />
      </View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.replace('Main')}>
        <Text style={styles.closeButton}> Test go to main screen</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openButton: {
    // marginBottom: 30,
    width: '90%',
    // padding: 10,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    borderColor: '#96FF53',
    borderWidth: 5,
  },
  closeButton: {
    // marginBottom: 30,
    width: '90%',
    // padding: 10,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    borderColor: '#96FF53',
    borderWidth: 5,
  },
  buttonText: {
    textAlign: 'center',
    padding: 2,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tahoma',
  },
  container: {
    padding: 5,
    // width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 30,
    // borderColor: 'blue',
    // backgroundColor: 'red',
  },
  textbox: {
    padding: 5,
    marginTop: 5,
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  registerbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    // backgroundColor: 'gray',
  },
});
export default Login;
