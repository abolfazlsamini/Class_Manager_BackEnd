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
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
const Register = ({navigation}) => {
  async function clearStorage() {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }
  const [username, setUsername] = useState({value: '', error: ''});
  const [name, setName] = useState({value: '', error: ''});
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

  const registerbtn = async () => {
    try {
      // setLoading(true);
      const response = await fetch('http://192.168.1.2:8000/api/register/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          //   Authorization: 'Token 5c2561b056ea18fac942b62d7d239ba30d6bfc17',
        },
        body: JSON.stringify({
          first_name: name.value,
          username: username.value,
          password: password.value,
        }),
      });
      const json = await response.json();
      if (response.status > 202) {
        console.error(json);
        return;
      }
      navigation.replace('Login');
      //   await EncryptedStorage.setItem('user_token', json.token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <Text style={styles.title}>صفحه ی ثبت نام:</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.textbox}
          label="name"
          placeholder="Name"
          placeholderTextColor="black"
          returnKeyType="next"
          value={name.value}
          onChangeText={text => setName({value: text, error: ''})}
          error={!!name.error}
          errorText={name.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="name"
        />
        <TextInput
          style={styles.textbox}
          label="Username"
          placeholder="Username"
          placeholderTextColor="black"
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
          label="Password"
          placeholder="Password"
          placeholderTextColor="black"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({value: text, error: ''})}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
      </View>
      <View style={styles.row}>
        <Button onPress={() => registerbtn()} title="ثبت نام" color={'green'} />
        <Button
          onPress={() => navigation.goBack('Login')}
          title="بازگشت به صفحه ورود"
        />
      </View>
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
});
export default Register;
