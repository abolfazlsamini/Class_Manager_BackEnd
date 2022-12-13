import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  function _onPressButton() {
    alert('You tapped the button!');
  }
  const getBookmarks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'http://192.168.1.2:8000/api/user/bookmarks',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Token 5c2561b056ea18fac942b62d7d239ba30d6bfc17',
          },
          // body: JSON.stringify({
          //   firstParam: 'yourValue',
          //   secondParam: 'yourOtherValue',
          // }),
        },
      );
      const json = await response.json();
      list = [];
      const bookmarks = json.map(bookmarks =>
        list.push({id: bookmarks.id, title: bookmarks.title}),
      );
      setData(list[0]);
      console.error(data);
    } catch (error) {
      setLoading(false);
      setData({ERROR: error});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  const Bookmark = () => {
    return (
      <View>
        <Text style={styles.buttonText}>
          title {isLoading ? 'Loading...' : data.title}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.button}>
          {Platform.OS != 'android' ? (
            <TouchableHighlight
              onPress={_onPressButton}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <Bookmark />
            </TouchableHighlight>
          ) : (
            <TouchableNativeFeedback
              onPress={_onPressButton}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <Bookmark />
            </TouchableNativeFeedback>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    marginBottom: 30,
    width: '100%',
    height: 60,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});

export default App;
