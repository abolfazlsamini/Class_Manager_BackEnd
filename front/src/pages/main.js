import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Button,
  RefreshControl,
} from 'react-native';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

const Main = ({navigation}) => {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? 'gray' : 'white',
  // };

  const [isLoading, setLoading] = useState({loading: true, error: ''});
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  function _onPressButton(id) {
    const newArray = [...data];
    const newId = newArray.findIndex(child => child.data.id === id);
    newArray[newId].state = !newArray[newId].state;
    setData(newArray);
  }
  const getBookmarks = async () => {
    try {
      const token = await EncryptedStorage.getItem('user_token');
      setLoading({loading: true, error: ''});
      setRefreshing(true);
      const response = await fetch(
        'http://192.168.1.2:8000/api/user/bookmarks',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Token ' + token,
          },
          // body: JSON.stringify({
          //   firstParam: 'yourValue',
          //   secondParam: 'yourOtherValue',
          // }),
        },
      );
      const json = await response.json();
      if (response.status !== 200) {
        console.error('cant get bookmark');
        return (
          <View>
            <Text>cant</Text>
          </View>
        );
      }
      list = [];
      openManage = [];
      for (let i = 0; i < Object.values(json).length; i += 1) {
        list.push({data: Object.values(json)[i], state: false});
        openManage.push({id: Object.values(json)[i].id, state: false});
      }

      setData(list);
      setLoading({loading: false, error: ''});
      setRefreshing(false);

      // console.log(Object.values(json)[3]);
    } catch (error) {
      setLoading({loading: false, error: error});
      setRefreshing(false);
      setData({ERROR: error});
    } finally {
      setLoading({loading: false, error: ''});
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   getBookmarks();
  // }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      getBookmarks();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  async function removeBookmarks(id) {
    setLoading({loading: true, error: ''});
    try {
      const token = await EncryptedStorage.getItem('user_token');
      const response = await fetch(
        'http://192.168.1.2:8000/api/user/bookmarks/remove-bookmark/',
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
      // navigation.replace('Main');
      getBookmarks();
    } catch (error) {
      console.error(error);
    }
  }
  const Bookmarks = () => {
    return data.length > 0 && isLoading.error === '' ? (
      data.map(bookmark => (
        <TouchableOpacity
          onPress={() => {
            _onPressButton(bookmark.data.id);
          }}
          activeOpacity={0.8}
          style={styles.container}>
          <View>
            {bookmark.state ? (
              <View style={styles.openButton}>
                {isLoading.loading ? (
                  <Text style={styles.buttonText}>title</Text>
                ) : (
                  <View>
                    <Text style={styles.buttonText}>
                      title {bookmark.data.title}
                    </Text>
                    <Text style={styles.buttonText}>
                      state {bookmark.data.state}
                    </Text>
                    <Text style={styles.buttonText}>
                      teacher {bookmark.data.teacher}
                    </Text>
                    <Button
                      title="حذف X"
                      onPress={() => removeBookmarks(bookmark.data.id)}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.closeButton}>
                {isLoading.loading ? (
                  <Text style={styles.buttonText}>title</Text>
                ) : (
                  <Text style={styles.buttonText}>{bookmark.data.title}</Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))
    ) : isLoading.error === '' ? (
      <View>
        <Text>You have no bookmarks</Text>
      </View>
    ) : (
      <View>
        {console.log(isLoading.error)}
        <Text>مشکلی در سرور پیش آمد</Text>
      </View>
    );
  };
  const Navbar = () => {
    return (
      <View style={styles.searchContainer}>
        {/* <TouchableOpacity
          style={styles.searchBtnView}
          onPress={() => navigation.push('Search')}>
          <Text style={styles.searchbutton}>search</Text>
        </TouchableOpacity> */}
        <View style={styles.searchBtnView}>
          <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
            <Button
              title="Add Bookmark +"
              color={'green'}
              onPress={() => navigation.push('Search')}
            />
            {/* <Button title="refresh" onPress={() => getBookmarks()} /> */}
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <StatusBar />
      {/* <View style={styles.searchContainer}>
        <View style={styles.searchBtnView}>
          <Text style={styles.searchbutton}>Hello, World!</Text>
        </View>
      </View> */}
      <Navbar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getBookmarks} />
        }>
        <Bookmarks />

        <TouchableOpacity
          style={styles.container}
          onPress={() => navigation.replace('Login')}>
          <Text style={styles.openButton}>Switch to login test btn</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  searchBtnView: {
    position: 'absolute',
    top: 0,
    width: '95%',
  },
  searchbutton: {
    borderRadius: 4,
    borderWidth: 2,
    height: 40,
    top: 8,
    borderColor: 'red',
    backgroundColor: 'rgb(72, 120, 166)',
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
    justifyContent: 'center',
    borderRadius: 10,

    // backgroundColor: 'red',
  },
  navbar: {
    padding: 0,
    width: '100%',
    height: 90,
    borderColor: '#FFFFFF',
    borderWidth: 5,
  },
  navbarbtn: {
    width: '20%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    // borderRadius: 10,
    borderColor: '#FFFFFF',
  },
  navbartxt: {
    justifyContent: 'center',
    fontWeight: 'bold',
  },
});

export default Main;
