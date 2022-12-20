import {useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

const Search = ({navigation}) => {
  const [input, setInput] = useState();
  const [searchData, setSearchData] = useState({value: [], error: ''});
  const [isLoading, setLoading] = useState({loading: false, error: ''});

  const getClasses = async title => {
    if (!title && title.length < 1) {
      return;
    }
    try {
      //   const token = await EncryptedStorage.getItem('user_token');
      setLoading({loading: true, error: ''});
      const response = await fetch(
        `http://192.168.1.2:8000/api/search/classes?title=${title}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Authorization: 'Token ' + token,
          },
          // body: JSON.stringify({
          //   firstParam: 'yourValue',
          //   secondParam: 'yourOtherValue',
          // }),
        },
      );
      const json = await response.json();
      if (response.status !== 200) {
        console.error('cant get Classes');
        return (
          <View>
            <Text>cant</Text>
          </View>
        );
      }
      // TODO return to main screen when added to bookmark

      list = [];
      openManage = [];
      //   console.error(json[0].title);
      for (let i = 0; i < Object.values(json).length; i += 1) {
        list.push({data: Object.values(json)[i], state: false});
        openManage.push({id: Object.values(json)[i].id, state: false});
      }
      if (list.length < 1) setLoading({loading: false, error: 'nothing found'});

      setSearchData({value: list, error: ''});
      setLoading({loading: false, error: ''});
      // console.log(Object.values(json)[3]);
    } catch (error) {
      setLoading({loading: false, error: error});
      setSearchData({value: list, error: ''});
    } finally {
      setLoading({loading: false, error: ''});
    }
  };
  async function addToBookmarks(id) {
    setLoading({loading: true, error: ''});
    try {
      const token = await EncryptedStorage.getItem('user_token');
      const response = await fetch(
        'http://192.168.1.2:8000/api/user/bookmarks/add-bookmark/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Token ' + token,
          },
          body: JSON.stringify({
            class_id: id,
          }),
        },
      );
      const json = await response.json();
      if (response.status !== 200) {
        setLoading({loading: false, error: error});
        console.error('cant get Classes');
        return (
          <View>
            <Text>cant</Text>
          </View>
        );
      }

      setLoading({loading: false, error: ''});
      navigation.popToTop();
    } catch (error) {
      console.error(error);
    }
  }
  const Classes = () => {
    return (
      <View>
        {searchData.value.map(classes => (
          <TouchableOpacity activeOpacity={0.8} style={styles.container}>
            {searchData.value.map(classes => classes.data.id) != 'undefined' ? (
              <View style={styles.openButton}>
                <Text style={styles.buttonText}>{classes.data.title}</Text>
                <Text style={styles.buttonText}>
                  {classes.data.time_start.slice(0, -3)} تا{' '}
                  {classes.data.time_end.slice(0, -3)}
                </Text>
                <Button
                  title="افزودن +"
                  onPress={() => addToBookmarks(classes.data.id)}
                />
              </View>
            ) : (
              <View>
                <Text>چیزی پیدا نشد</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView>
      <StatusBar />
      <Button title="بازگشت" onPress={() => navigation.goBack()} />

      <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setInput(text)}
          onSubmitEditing={() => {
            getClasses(input);
          }}></TextInput>
        <Button
          title="search"
          onPress={() => {
            getClasses(input);
          }}
        />
      </View>

      {isLoading.error != '' ? (
        <View>
          {/* {console.error(isLoading.error)} */}
          <Text>مشکلی در سرور پیش آمد</Text>
        </View>
      ) : (
        <ScrollView>
          <View>
            {isLoading.loading ? (
              <View>
                <Text>loading...</Text>
              </View>
            ) : (
              <Classes />
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  closeButton: {
    width: '90%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    borderColor: '#96FF53',
    borderWidth: 5,
  },
  container: {
    padding: 5,
    justifyContent: 'center',
    borderRadius: 10,
  },
  textInput: {
    margin: 10,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
    fontSize: 20,
    width: '60%',
    color: 'black',
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
  container: {
    padding: 5,
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    padding: 2,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tahoma',
  },
});
export default Search;
